from datetime import date
import random
import traceback
import json
import time

from django.http import HttpResponse, HttpResponseBadRequest, QueryDict
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core import serializers
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt


from users.models import UserProfile, UserApplication, Session, PostDataTemp, PostDataTempArch, User


@csrf_exempt
#def form():

def loadnewapps(request):
	countTmpPD = 0
	PostDataTempAll = PostDataTemp.objects.all()
	for pdt in PostDataTempAll:
		countTmpPD = countTmpPD + 1
		postdataT = json.loads(str(pdt.value))
		postdata = QueryDict('')
		postdata = postdata.copy()
		postdata.update(postdataT)
		postdata = postdata
		if postdata:
		    session_key = str(random.randint(0,100000000000000))
		    for key in postdata:
		        """new_record = PostData(key=key, value=postdata[key], session_key=session_key)
		        new_record.save()"""
		    try:
		        email = postdata['EMail'].strip()
		    except:
			email = ""
		    try:
		        first_name = postdata['Imie'].strip()
		    except:
		        first_name = ""
		    try:
		        last_name = postdata['Nazwisko'].strip()
		    except:
		        last_name = ""
		    try:
		        date_from = date(*map(int,reduce(lambda x,y: [y,]+x, postdata['Przyjazd'].split('.'),[])))
		    except:
		        date_from = None
		    try:
		        date_to = date(*map(int,reduce(lambda x,y: [y,]+x, postdata['Odjazd'].split('.'),[])))
		    except:
		        date_to = None
		    users_with_email = User.objects.filter(email=email)
		    username = email if len(email)<30 else email[:30]
		    if users_with_email:
		        username = "%s_%s" % (username, users_with_email.count()+1)
		    users=User.objects.filter(first_name=first_name, last_name=last_name)
		    try:
			age = date.today().year - int(postdata['Wiek'])
		    except:
		        age = 0
		    try:
		        city = postdata['Miasto']
		    except:
		        city = ""
		    try:
		        first_time = unicode(postdata['CzyPierwszyRaz'])==unicode('tak')
		    except:
		        first_time = False
		    try:
		        rules_accept = unicode(postdata['AkceptacjaRegulaminu'])==unicode('tak')
		    except:
		        rules_accept = False
		    try:
		        email_accept = unicode(postdata['EmailInformacje'])==unicode('tak')
		    except:
		        email_accept = False
		    try:
		        phone = postdata['Telefon']
		    except:
		        phone=""
		    try:
		        start_time = int(postdata['PrzyjazdGodzina'])
		    except:
		        start_time = None
		    try:
		        end_time = int(postdata['OdjazdGodzina'])
		    except:
		        end_time = None
		    
		    if users:
		        user = users[0]
		    else:
		        user = User(username=username, email=email, first_name=first_name, last_name=last_name)
		        user.save()
		    try:
		        profile = user.get_profile()
		    except:
		        profile = UserProfile(user=user)
		    profile.age = age
		    profile.city = city
		    profile.first_time = first_time
		    profile.phone = phone
		    profile.save()
		    try:
		        sessions = Session.objects.filter(start_date__lte=date_from, end_date__gt=date_from)
		        if not sessions:
		            sessions = Session.objects.filter(start_date__lt=date_to, end_date__gte=date_to)
		        elif len(sessions)>1:
		            sessions.filter(start_date__lt=date_to, end_date__gte=date_to)
		        if sessions:
		            session = sessions[0]
		        else:
		            session = None
		    except:
		        session = None
		    application = UserApplication(user=user, 
		                                  session=session, 
		                                  start_date = date_from, 
		                                  start_time = start_time, 
		                                  end_date = date_to, 
		                                  end_time = end_time, 
		                                  first_time = first_time, 
		                                  rules_accept = rules_accept,
		                                  email_accept = email_accept,
		                                  session_key=session_key)
		    application.save()
		    pdtTemp = PostDataTempArch(value=postdataT)
		    pdtTemp.save()
		    pdt.delete()

	return render_to_response('loadnewapps.html',{'countTmpPD':countTmpPD, 'PostDataTempAll':PostDataTempAll})

def create_app( postdata ):
    print(postdata)
    print('hello')
    """Create application from given data:
<QueryDict: {
    u'Imie': [u'test'], 
    u'Nazwisko': [u'test'], 
    u'Odjazd': [u'04.12.2012'], 
    u'Wiek': [u'11'], 
    u'Telefon': [u'test'], 
    u'Miasto': [u'test'], 
    u'Przyjazd': [u'04.12.2012'], 
    u'PrzyjazdGodzina': [u'11'], 
    u'Oswiadczenie': [u'tak'], 
    u'CzyPierwszyRaz': [u'tak'], 
    u'OdjazdGodzina': [u'11'],
    u'EMail': [u'andrzej.bol@gmail.com']
}>
?Imie=test&Nazwisko=test&Odjazd=04.12.2012&Wiek=11&Telefon=test&Miasto=test&Przyjazd=04.12.2012&PrzyjazdGodzina=11&Oswiadczenie=tak&CzyPierwszyRaz=tak&OdjazdGodzina=11&EMail=andrzej.bol@gmail.com
http://guru.hipisi.org.pl/create_app/?Imie=test&Nazwisko=test&Odjazd=04.12.2012&Wiek=11&Telefon=test&Miasto=test&Przyjazd=04.12.2012&PrzyjazdGodzina=11&Oswiadczenie=tak&CzyPierwszyRaz=tak&OdjazdGodzina=11&EMail=andrzej.bol@gmail.com&AkceptacjaRegulaminu=tak&EmailInformacje=tak
    """
    """try:
        if postdata:
            session_key = str(random.randint(0,100000000000000))
            for key in postdata:
                new_record = PostData(key=key, value=postdata[key], session_key=session_key)
                new_record.save()
            try:
                email = postdata['EMail'].strip()
            except:
		email = ""            
            try:
                first_name = postdata['Imie'].strip()
            except:
                first_name = ""
            try:
                last_name = postdata['Nazwisko'].strip()
            except:
                last_name = ""
            try:
                date_from = date(*map(int,reduce(lambda x,y: [y,]+x, postdata['Przyjazd'].split('.'),[])))
            except:
                date_from = None
            try:
                date_to = date(*map(int,reduce(lambda x,y: [y,]+x, postdata['Odjazd'].split('.'),[])))
            except:
                date_to = None
            users_with_email = User.objects.filter(email=email)
            username = email if len(email)<30 else email[:30]
            if users_with_email:
                username = "%s_%s" % (username, users_with_email.count()+1)
            users=User.objects.filter(first_name=first_name, last_name=last_name)
            try:
                age = int(postdata['Wiek'])
            except:
                age = 0
            try:
                city = postdata['Miasto']
            except:
                city = ""
            try:
                first_time = unicode(postdata['CzyPierwszyRaz'])==unicode('tak')
            except:
                first_time = False
            try:
                rules_accept = unicode(postdata['AkceptacjaRegulaminu'])==unicode('tak')
            except:
                rules_accept = False
            try:
                email_accept = unicode(postdata['EmailInformacje'])==unicode('tak')
            except:
                email_accept = False
            try:
                phone = postdata['Telefon']
            except:
                phone=""
            try:
                start_time = int(postdata['PrzyjazdGodzina'])
            except:
                start_time = None
            try:
                end_time = int(postdata['OdjazdGodzina'])
            except:
                end_time = None
            if users:
                user = users[0]
            else:
                user = User(username=username, email=email, first_name=first_name, last_name=last_name)
                user.save()
            try:
                profile = user.get_profile()
            except:
                profile = UserProfile(user=user)
            profile.age = age
            profile.city = city
            profile.first_time = first_time
            profile.phone = phone
            profile.save()
            try:
                sessions = Session.objects.filter(start_date__lte=date_from, end_date__gt=date_from)
                if not sessions:
                    sessions = Session.objects.filter(start_date__lt=date_to, end_date__gte=date_to)
                elif len(sessions)>1:
                    sessions.filter(start_date__lt=date_to, end_date__gte=date_to)
                if sessions:
                    session = sessions[0]
                else:
                    session = None
            except:
                session = None
            application = UserApplication(user=user, 
                                          session=session, 
                                          start_date = date_from, 
                                          start_time = start_time, 
                                          end_date = date_to, 
                                          end_time = end_time, 
                                          first_time = first_time, 
                                          rules_accept = rules_accept,
                                          email_accept = email_accept,
                                          session_key=session_key)
            application.save()
    
    except Exception, e:
        print "Couldn't do it: %s" % e
        traceback.print_exc()"""

def externform(request):
	toDate = date.today().year
	fromDate = toDate - 120
	defDate = toDate - 35
	dateOpts = ""
	for i in range(fromDate,toDate):
		if i == defDate:
			defSelect = ' selected="selected"'
		else:
			defSelect = ''
		dateOpts = dateOpts + '<option value="'+str(i)+'"'+defSelect+' />'+str(i)+'</optioni>'
	aktSesje = Session.objects.filter(regstart__lte=date.today(),regend__gte=date.today(),manualend=False)
	countSesje = 0
	sesOpts = ""
	for cS in aktSesje:
		countSesje = countSesje + 1
		sesOpts = sesOpts + '<option value="'+str(cS.start_date)+'-'+str(cS.end_date)+'">'+str(cS.start_date)+' - '+str(cS.end_date)+'</option>'
	return render_to_response('externform.html',{'dateOpts':dateOpts, 'sesOpts':sesOpts, 'countSesje':countSesje},context_instance=RequestContext(request))

def submit_app( request, xml = False, template_name = 'submit_app.html' ):
        postdata = None
        if request.method == 'POST':
		postdata = request.POST.copy()
        if request.method == 'GET':
        	postdata = request.GET.copy()
        if postdata:
		
		request_string = json.dumps(postdata, ensure_ascii=False)
		new_record = PostDataTemp(value=request_string)
            	new_record.save()
	return render_to_response('submit_app.html')
