import http.client, urllib.request, urllib.parse, urllib.error, base64
import itertools
import numpy as np
import math
from collections import defaultdict


def get_viewpr(pk):
    params = urllib.parse.urlencode({'Id': pk})
    return call_viewpr(params)


def search_viewpr(category, lat, lon):
    params = urllib.parse.urlencode({
        # 'name': 'Yunque',
        # 'address': '{string}',
        # 'neighborhood': '{string}',
        # 'city': '{string}',
        'latitude': lat,
        'longitude': lon,
        # 'radiusOfBuffer': 200,
        # 'businessStatus': '1',
        # 'activity': '{string}',
        'category': category,
        # 'type': '{string}',
        # 'amenity': '{string}',
        # 'characteristic': '{string}',
        # 'lastUpdated': '{string}',
        # 'Id': '{number}',
    })
    return call_viewpr(params)


def call_viewpr(params):
    headers = {
        'Ocp-Apim-Subscription-Key': '09150f80b3634a11aa9df36d9d6faba5',
    }

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


def euclidean(v1, v2):
    dist = [(a - b)**2 for a, b in zip(v1, v2)]
    dist = math.sqrt(sum(dist))
    return dist


def solve(payload):
    # Make list of objects
    ids = []
    coors = []
    for obj in payload.values():
        ids.append(obj['id'])
        coors.append(np.array((obj['lat'], obj['lon'])))
    n = len(ids)
    if n > 10:
        print('Cant optimize!')
        return ids

    # Make distance matrix.
    matrix = defaultdict(dict)
    for i, v1 in enumerate(coors):
        for j, v2 in enumerate(coors):
            matrix[i][j] = euclidean(v1, v2)

    # Make permutations (can be of indices).
    perms = list(itertools.permutations(range(len(ids))))

    # Check cost of path.
    costs = []
    for i, path in enumerate(perms):
        cost = 0
        a = path[0]
        for j in range(1, n):
            b = path[j]

            cost += matrix[a][b]

            a = b
        costs.append((cost, i))

    # Take min cost
    cost, i = min(costs, key=lambda x: x[0])
    return [ids[j] for j in perms[i]]
