import json
import re

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.conf import settings

from main.util import search_viewpr, get_viewpr, solve

import requests

# San Juan
DEFAULT_LAT = 18.4655
DEFAULT_LON = -66.1057
DEFAULT_IMAGE = 'static/main/default-placeholder.png'


def index(request):
    # default to San Juan in localhost or if no ip.
    city, lat, lon = get_location_from_ipaddress(request)
    city, lat, lon = (
        city or 'San Juan',
        DEFAULT_LAT,
        DEFAULT_LON,
    )

    return render(request, 'main/index.html', context={'lat': lat, 'lon': lon})


CONVERTED = {
    'adventure': 'Adventure & Sports',
    'culture': 'Culture & Science',
    'landmark': 'Historic Sites and Landmarks',
    'leisure': 'Leisure & Recreational',
    'nature': 'Nature',
    'nightlife': 'Night Life',
}

tripadvisor_cache = {}


def attach_trip_advisor(results):
    for result in results:
        if result['id'] in tripadvisor_cache:
            result['rating_image_url'] = tripadvisor_cache[result['id']][
                'rating_image_url']
            result['num_reviews'] = tripadvisor_cache[result['id']][
                'num_reviews']
            continue

        try:
            link = result['tripadvisor']
            print(link)
            m = re.search('-d[0-9]+-', link)
            word = m.group(0)
            tid = word[2:-1]
            res = requests.get(
                'http://api.tripadvisor.com/api/partner/2.0/location/' + tid,
                params={'key': '7b70e265-3bf5-4a69-bf5c-27427c96f913'})
            # print(res.status_code)
            # print(res.text)
            res_json = res.json()
            result['rating_image_url'] = res_json['rating_image_url']
            result['num_reviews'] = res_json['num_reviews']
            tripadvisor_cache[result['id']] = {
                'rating_image_url': res_json['rating_image_url'],
                'num_reviews': res_json['num_reviews']
            }
        except KeyError as e:
            result['rating_image_url'] = ''
            result['num_reviews'] = '-'
            pass


def sorting_key(result):
    points = 0

    if result['image'] == DEFAULT_IMAGE:
        points += 1

    if result['num_reviews'] != '-':
        points -= 1

    return points


def planning(request):
    categories = request.GET.get('categories', '')
    categories = [CONVERTED[c] for c in categories.split(',')]

    lat = request.GET.get('lat', DEFAULT_LAT)
    lon = request.GET.get('lon', DEFAULT_LON)
    print(categories, lat, lon)

    results = []
    for c in categories:
        results.extend(json.loads(search_viewpr(c, lat, lon)))

    attach_trip_advisor(results)
    default_image(results)

    results = sorted(results, key=sorting_key)
    return render(request, 'main/planning.html', context={'results': results})


def plan(request):
    """Accepts the POST /plan to do schedule algorithm

    Algorithm is make distance matrix.
    Find shortest path starting at 1, at 2, at 3.

    """
    payload = json.loads(request.body)

    path = solve(payload)

    return JsonResponse({
        'url':
        '/schedule?path=' + ','.join([str(i) for i in path])
    })


def default_image(results):
    for result in results:
        try:  # Try to load first image; else default to a placeholder.
            result['image'] = result['media'][0]
        except KeyError as e:
            result['image'] = DEFAULT_IMAGE


def schedule(request):
    path = request.GET.get('path', '')
    path = path.split(',')

    results = []
    for i in path:
        results.extend(json.loads(get_viewpr(i)))

    default_image(results)
    return render(request, 'main/schedule.html', context={'results': results})


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_location_from_ipaddress(request):
    ipaddress = get_client_ip(request)
    res = requests.get(
        'http://api.ipstack.com/' + ipaddress,
        params={
            'access_key': settings.IPSTACK_KEY,
            'format': 1
        })
    print(res.status_code)
    print(res.text)
    res_json = res.json()
    return (res_json['city'], res_json['latitude'], res_json['longitude'])
