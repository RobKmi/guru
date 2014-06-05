# -*- encoding: utf-8 -*-

from django.contrib import admin
from django.contrib.auth.models import Group, User
from django.db import transaction
from django.utils.functional import update_wrapper
from django.http import HttpResponse
from django.contrib.admin.options import ModelAdmin
from django.contrib.auth.admin import UserAdmin
from django.template.loader import render_to_string
from django.shortcuts import render_to_response
import uuid
import re
from django.conf.urls.defaults import patterns, url
#from django.views.generic.simple import redirect_to
from django.views.generic import RedirectView
from django.shortcuts import redirect
from django import forms
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse
from django.contrib.admin.widgets import FilteredSelectMultiple

from django.utils.datastructures import SortedDict

from users.models import UserApplication, UserPayment, UserProfile, Session, Action, PostDataTemp, PostDataTempArch

admin.site.unregister(User)
#admin.site.unregister(Group)

class UserProfileInline(admin.StackedInline):
    model = UserProfile

class UserProfileAdmin(UserAdmin):
    #inlines = [ UserProfileInline,'_age' ]
    class Meta:
	verobse_name = _("Gość")
	verbose_name_plural = _("Goście")

    def age(self, obj):
        try:
            return obj.get_profile().age
        except UserProfile.DoesNotExist:
            return ''
    age.short_description = _("Wiek")
    def city(self, obj):
        try:
            return obj.get_profile().city
        except UserProfile.DoesNotExist:
            return ''
    city.short_description = _("Miasto")
    def money(self, obj):
        try:
            return obj.get_profile().money()
        except UserProfile.DoesNotExist:
            return ''
    money.short_description = _(u"Wpłata")
    def phone(self, obj):
        try:
            return obj.get_profile().phone
        except UserProfile.DoesNotExist:
            return ''
    phone.short_description = _("Telefon")
    list_display = UserAdmin.list_display + ('phone', 'age', 'city', 'money',)
#    list_filter = UserAdmin.list_filter + ('userprofile__age', 'userprofile__city')
#    filter_horizontal = []
#    list_display = ('first_name', 'last_name', 'email', 'age', 'city', 'money', 'phone')#), '_payments')
#    list_filter = ('age', 'city')
#    def _payments(self, obj): 
#        payments =  UserPayment.objects.filter(user=obj.user)
#        _datas = map(lambda payment: {'url': reverse('admin:campaign_payment_change', args=[payment.id ,]), 'name': unicode(payment)}, payments)
#        return render_to_string("users/changelist_payments_field.html", { 'payments': _datas, 'id': obj.id})
#    def response_add(self, request, obj, post_url_continue='../%s/'):
#        if '_popup' in request.GET:
#            return render_to_response('campaign/response_payment.html')
#        else:
#            return super(UserProfileAdmin, self).response_add(request, obj,
#                                                           post_url_continue)    
#    _payments.allow_tags = True
#    _payments.short_description = _("Lista wpłat") 

class UserApplicationAdmin(admin.ModelAdmin):
    list_display = ( '_last_name', '_first_name', '_email', '_phone', '_age', '_city', '_money', 'first_time', 'status', 'session', 'creation_date')#, '_payments')
#    list_filter = ('age', 'city')
    list_filter = ('session', 'first_time', 'status', 'creation_date')
    ordering = ('creation_date',)

#    actions = Action.get_actions()

    def _first_name(self, obj):
        return obj.user.first_name
    _first_name.short_description = _(u"Imię")
    def _last_name(self, obj):
        return obj.user.last_name
    _last_name.short_description = _("Nazwisko")
    def _email(self, obj):
	tmpemail = obj.user.email
	retemail = (tmpemail[:20] + '..') if len(tmpemail) > 20 else tmpemail
        return retemail
    _email.short_description = _("Email")
    def _age(self, obj):
        return obj.user.get_profile().age
    _age.short_description = _("Wiek")
    def _city(self, obj):
        return obj.user.get_profile().city
    _city.short_description = _("Miasto")
    def _money(self, obj):
        return obj.user.get_profile().money()
    _money.short_description = _(u"Wpłata")
    def _phone(self, obj):
        return obj.user.get_profile().phone
    _phone.short_description = _("Telefon")
    def _payments(self, obj): 
        payments =  UserPayment.objects.filter(user=obj.user)
#        _datas = map(lambda payment: {'url': "reverse('admin:users_payment_change')", args=[payment.id ,]), 'name': unicode(payment)}, payments)
#        return render_to_string("users/changelist_payments_field.html", { 'payments': _datas, 'id': obj.id})
    def response_add(self, request, obj, post_url_continue='../%s/'):
        if '_popup' in request.GET:
            return render_to_response('campaign/response_payment.html')
        else:
            return super(UserApplicationAdmin, self).response_add(request, obj,
                                                           post_url_continue)
    _payments.allow_tags = True
    _payments.short_description = _("Lista wpłat") 

    def get_actions(self, request):
        actions = super(UserApplicationAdmin, self).get_actions(request)
        actions.update(SortedDict([
            (name, (func, name, desc))
            for func, name, desc in [self.get_action(action) for action in Action.get_actions()]
        ]))
        return actions

class SessionAdmin(admin.ModelAdmin):
    list_display = ('uid', 'start_date', 'end_date', 'maxcap', 'maxcapnew', 'regstart', 'regend', 'manualend')

class ActionAdmin(admin.ModelAdmin):
    list_display = ('name', 'topic', 'status', 'required_status')

admin.site.register(UserApplication, UserApplicationAdmin)
admin.site.register(UserPayment, ModelAdmin)
admin.site.register(User, UserProfileAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(Action, ActionAdmin)
#admin.site.register(PostData, ModelAdmin)
admin.site.register(PostDataTemp, ModelAdmin)
admin.site.register(PostDataTempArch, ModelAdmin)

