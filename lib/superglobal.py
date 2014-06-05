# coding: utf-8 
'''
Created on 23-10-2012

@author: beret
'''


from threading import currentThread 
_requests = {}
_users = {}

def len_users():
    if currentThread() in _users:
        return len(_users[currentThread()])
    else:
        return 0

def get_request():
    return _requests[currentThread()]

def set_user(user):
    if currentThread() in _users:
        _users[currentThread()].append(user)
    else:
        _users[currentThread()] = [user,]

def pop_user():
    if currentThread() in _users:
        return _users[currentThread()].pop()    

def get_user():
    if currentThread() in _users:
        return _users[currentThread()][-1]
    elif currentThread() in _requests:
        request =  _requests[currentThread()]
        user = request.user
        set_user(user)
        return user
    else:
        return None

class GlobalRequestMiddleware(object):
    def process_request(self, request):  
        _requests[currentThread()] = request