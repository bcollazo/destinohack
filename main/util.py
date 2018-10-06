import http.client, urllib.request, urllib.parse, urllib.error, base64


def search_viewpr(category):
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
