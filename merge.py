import os, csv, json

TOP_LEVEL_COLUMNS_MAP = {0: 'objectID', 1: 'food_types', 2: 'stars_count', 3: 'reviews_count', 4: 'neighborhood', 5: 'phone_number', 6: 'price_range', 7: 'dining_style'}

def flatten(d):
    res = []  # Result list
    if isinstance(d, dict):
        for key, val in d.items():
            res.extend(flatten(val))
    elif isinstance(d, list):
        res = d
    else:
        raise TypeError("Undefined type for flatten: %s"%type(d))

    return res

def pair():
    new_data = {}
    with open('restaurants_list.json') as data_file:
        restaurant_list = json.load(data_file)
        for restaurant in restaurant_list:
            temp_id = restaurant["objectID"]
            new_data[temp_id] = restaurant
            # del new_data[temp_id]["objectID"]
        # print new_data
    with open('restaurants_info.csv', 'rb') as csvfile:
        line = csv.reader(csvfile, delimiter=';', quotechar='|')
        count = 0
        for row in line:
            # make sure to skip over object ID in this dumb thing.
            try:
                idx = int(row[0])
            except ValueError as verr:
                print 'value error'
                continue
            except Exception as ex:
                print 'exception'
                continue
            count += 1
            for column_key in range(len(row)):
                column_name = TOP_LEVEL_COLUMNS_MAP[column_key]
                # print column_name
                # print row[column_key]
                new_data[idx][column_name] = row[column_key]
    # at this point, the structure looks like this
    # { 123: {}}
    # need to make it an array of object
    json_list = [value for key, value in new_data.iteritems() ]
    with open('restaurants_enriched.json', 'w') as outfile:
        json.dump(json_list, outfile)
    print "Number of records enriched: (should be 5000)"
    print count
pair()
