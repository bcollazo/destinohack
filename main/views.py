import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from main.util import search_viewpr


def index(request):
    return render(request, 'main/index.html')


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
    print(categories)

    results = []
    for c in categories:
        results.extend(json.loads(search_viewpr(c)))

    for result in results:
        try:  # Try to load first image; else default to a placeholder.
            result['image'] = result['media'][0]
        except KeyError as e:
            result['image'] = 'static/main/default-placeholder.png'

    return render(request, 'main/planning.html', context={'results': results})


def plan(request):
    """Accepts the POST /plan to do schedule algorithm

    Algorithm is make distance matrix.
    Find shortest path starting at 1, at 2, at 3.

    """
    print(request.POST)

    return JsonResponse({'url': '/schedule?bryan'})


def schedule(request):
    return HttpResponse('Hola')
