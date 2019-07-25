import logging
import os.path
from os import path
import azure.functions as func
import json
from linkedin_api import Linkedin
import numpy as np

filteredConnections=[]
profilesInfo={}
profilesInfo['people'] = []

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    return getConnections(req)


def populateData(profile):
    data={}
    data['name'] = profile['name']
    data['link'] = profile['link']
    data['initials'] = profile['initials']
    data['headline'] = profile['headline']
    return data


def getConnections(req: func.HttpRequest) -> func.HttpResponse:
    results=[]
    content = req.get_json()
    logging.info(content)    
    tag = content['tag'].lower()
    keyword = content['keyword'].lower()
    email = content['email']

    filteredConnections = []

    if (path.exists(email+'.txt') == False):
        api = Linkedin(content['email'], content['password'])
        logging.info("Starting Search People")
        connections = api.search_people()
        for connection in connections:
            id = connection['public_id']
            if (id not in filteredConnections and connection['distance'] == 'DISTANCE_1' and len(filteredConnections) <= 5):
                filteredConnections.append(id)

        for public_id in filteredConnections:            
            retrieve = api.get_profile(public_id)
            name = retrieve['firstName']+' '+retrieve['lastName']
            link = 'https://www.linkedin.com/in/'+public_id+'/'
            # imgr=retrieve['profilePictureOriginalImage']['com.linkedin.common.VectorImage']['rootUrl']
            # imgi=retrieve['profilePictureOriginalImage']['com.linkedin.common.VectorImage']['artifacts'][1]['fileIdentifyingUrlPathSegment']
            # data['img']=imgr+imgi
            data = {}
            data['name'] = name
            data['link'] = link
            data['initials'] = ''.join(letter[0].upper()
                                       for letter in name.split())
            if ('skills' in retrieve):
                data['skills'] = retrieve['skills']
            data['headline'] = retrieve['headline']
            if ('experience' in retrieve and len(retrieve['experience']) > 0):
                data['company'] = retrieve['experience'][0]['companyName']
                data['title'] = retrieve['experience'][0]['title']
            if ('locationName' in retrieve):
                data['location'] = retrieve['locationName']
            elif ('geoLocationName' in retrieve):
                data['location'] = retrieve['geoLocationName']
            profilesInfo['people'].append(data)
        with open(email+'.txt', 'w') as file:
            file.write(json.dumps(profilesInfo))
    
    with open(email+'.txt', 'r') as file:
        profiles = json.load(file)

        for profile in profiles['people']:
            if (len(results) >= 5):
                break

            if (tag == 'location' and 'location' in profile and keyword.lower() in profile['location'].lower()):
                data = populateData(profile)
                results.append(data)
            elif (tag == 'company' and 'company' in profile and keyword.lower() in profile['company'].lower()):
                data = populateData(profile)
                results.append(data)
            elif (tag == 'title' and 'title' in profile and keyword.lower() in profile['title'].lower()):
                data = populateData(profile)
                results.append(data)
            elif (tag == 'skills' and 'skills' in profile):
                skillist = profile['skills']
                if any(keyword.lower() in s['name'].lower() for s in skillist[1:]):
                    data = populateData(profile)
                    results.append(data)

    return func.HttpResponse(json.dumps(results))
