# coding: utf-8
'''
Created on 31-10-2012

@author: beret
'''

from django.conf import settings

if settings.DEBUG_ENABLE_TRACE:
    from django.template import Library, Node
    
    register = Library()
    
    try:
        import ipdb as pdb
    except ImportError:   
        import pdb
    
    trace = pdb.set_trace
    
    class PdbNode(Node):
        def render(self, context):
            # Access vars at the prompt for an easy reference to
            # variables in the context
            vars = []
            for dict in context.dicts:
                for k, v in dict.items():
                    vars.append(k)
                    locals()[k] = v
            pdb.set_trace()
            return ''
    
    @register.tag("pdbdebug")
    def pdbdebug_tag(parser, token):
        """Tag that inspects template context.
    
        Usage: 
        {% pdb_debug %}
    
        You can then access your context variables directly at the prompt.
    
        The vars variable additonally has a reference list of keys
        in the context.
        """
        return PdbNode()
    
    @register.filter("pdbdebug")
    def pdbdebug_filter(value, arg=None):
        """Filter that inspects a specific
        variable in context.
    
        Usage:
        {{ variable|pdbdebug }}
        """
        pdb.set_trace();  
        return ''
else:
    def trace():
        pass

    from django.template import Library
    
    register = Library()

    @register.tag("pdbdebug")
    def pdbdebug_tag(parser, token):
        return ''

    @register.filter("pdbdebug")
    def pdbdebug_filter(value, arg=None):
        return ''

def pprint(data):
    from pprint import pprint
    if settings.DEBUG_FORM_WIZARD:
        pprint(data)