import json
import http.client, urllib.request, urllib.parse, urllib.error, base64

from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, 'main/index.html')


def planning(request):
    categories = request.GET.get('categories', '')
    print(categories)

    res = make_call('Adventure & Sports')
    results = json.loads(res)

    for result in results:
        try:
            result['image'] = result['media'][0]
        except KeyError as e:
            result['image'] = 'static/main/default-placeholder.png'

    return render(request, 'main/planning.html', context={'results': results})


def make_call(category):
    headers = {
        'Ocp-Apim-Subscription-Key': '09150f80b3634a11aa9df36d9d6faba5',
    }

    params = urllib.parse.urlencode({
        # 'name': 'Yunque',
        # 'address': '{string}',
        # 'neighborhood': '{string}',
        # 'city': '{string}',
        # 'latitude': '{number}',
        # 'longitude': '{number}',
        # 'radiusOfBuffer': '{string}',
        # 'businessStatus': '1',
        # 'activity': '{string}',
        'category': category,
        # 'type': '{string}',
        # 'amenity': '{string}',
        # 'characteristic': '{string}',
        # 'lastUpdated': '{string}',
        # 'Id': '{number}',
    })

    try:
        conn = http.client.HTTPSConnection('viewpr.azure-api.net')
        conn.request("GET", "/api/venue?%s" % params, "{body}", headers)
        response = conn.getresponse()
        data = response.read()
        conn.close()
        return data
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))
        return None
