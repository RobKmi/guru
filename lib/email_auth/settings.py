# coding: utf-8
'''
Created on 05-11-2012

@author: beret
'''

import os

AUTHENTICATION_BACKENDS = ('backends.EmailAuthBackend',)
MODULE_ROOT = os.path.realpath(os.path.dirname(__file__))
TEMPLATE_DIRS = (
    os.path.join(MODULE_ROOT, 'templates'),
)