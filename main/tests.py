from django.test import SimpleTestCase

from main.util import solve


class AlgoTests(SimpleTestCase):
    def test_hello(self):
        payload = {
            '25217': {
                'id': 25217,
                'name': '',
                'lat': 18.4660562,
                'lon': -66.1190552
            },
            '32064': {
                'id': 32064,
                'name': '',
                'lat': 18.465708,
                'lon': -66.112062
            },
            '32514': {
                'id': 32514,
                'name': '',
                'lat': 18.4663926,
                'lon': -66.107964
            }
        }

        path = solve(payload)
        self.assertEqual(path, [25217, 32064, 32514])
