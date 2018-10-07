import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.conf import settings

from main.util import search_viewpr, get_viewpr, solve

import requests

# San Juan
DEFAULT_LAT = 18.4655
DEFAULT_LON = -66.1057


def index(request):
    # default to San Juan in localhost or if no ip.
    city, lat, lon = get_location_from_ipaddress(request)
    city, lat, lon = (
        city or 'San Juan',
        lat or DEFAULT_LAT,
        lon or DEFAULT_LON,
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


def planning(request):
    categories = request.GET.get('categories', '')
    categories = [CONVERTED[c] for c in categories.split(',')]

    lat = request.GET.get('lat', DEFAULT_LAT)
    lon = request.GET.get('lon', DEFAULT_LON)
    print(categories, lat, lon)

    results = []
    for c in categories:
        results.extend(json.loads(search_viewpr(c, lat, lon)))

    default_image(results)
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
            result['image'] = 'static/main/default-placeholder.png'


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
