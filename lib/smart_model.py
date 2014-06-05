# coding: utf-8
'''
Created on 23-10-2012

@author: beret
'''

from django.db import models
from lib.superglobal import get_user
from django.contrib.auth.models import AnonymousUser

class SmartManager(models.Manager):
    def __init__(self, _filter=True):
        super(SmartManager, self).__init__()
        self._filter = _filter
    def get_query_set(self):
        query_set = super(SmartManager, self).get_query_set()
        if self._filter:
            qs_filter = getattr(self.model, 'get_query_set', None)
            if qs_filter:
                user = get_user()
                if not user:
                    user = AnonymousUser()
                elif user.is_superuser:
                    return query_set
                return qs_filter(query_set, user)
        return query_set

class SmartModel(models.Model):
    class Meta:
        abstract = True
    def save(self, force_insert = False, force_update = False):
        self.created_by = get_user()
        return super(SmartModel, self).save(force_insert = force_insert, force_update = force_update)
        