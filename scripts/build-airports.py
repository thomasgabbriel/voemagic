"""Build the local catalog from OurAirports airports.csv and countries.csv."""
import csv
import json
import sys
from pathlib import Path

source = Path(sys.argv[1])
target = Path(__file__).resolve().parents[1] / 'public' / 'data'

def read(filename):
    with (source / filename).open(encoding='utf-8-sig', newline='') as file:
        return list(csv.DictReader(file))

countries = {row['code']: row['name'] for row in read('countries.csv')}
airports = []
for row in read('airports.csv'):
    if row['type'] not in {'large_airport', 'medium_airport', 'small_airport', 'seaplane_base'}:
        continue
    airport_code = row['iata_code']
    code = airport_code or row['icao_code'] or row['ident']
    priority = 4 if row['type'] == 'large_airport' else 2 if row['scheduled_service'] == 'yes' else 0
    airports.append([code, row['municipality'], row['name'], row['iso_country'], priority, row['ident']])

target.mkdir(parents=True, exist_ok=True)
(target / 'airports.json').write_text(json.dumps([countries, airports], ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'{len(airports)} aeroportos')
