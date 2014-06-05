# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User, UserManager
from django.db.models.signals import post_save, pre_save
from django.template.loader import render_to_string, get_template_from_string, Context

import datetime

_ = lambda x: x

STATUSES = (('new','Nierozpatrzone'),
            ('accept','Zapisany'),
            ('reserve','Lista rezerwowa'),
            ('reject','Odrzucone'),
            )
 
"""
  <Imie>imie</Imie>
  <Nazwisko>nazwisko</Nazwisko>
  <EMail>nazwisko</EMail>
  <Telefon>nazwisko</Telefon>
  <Miasto>miasto</Miasto>
  <Wiek>11</Wiek>
  <Przyjazd>04.10.2012</Przyjazd>
  <PrzyjazdGodzina>11</PrzyjazdGodzina>
  <Odjazd>04.10.2012</Odjazd>
  <OdjazdGodzina>11</OdjazdGodzina>
  <CzyPierwszyRaz>tak<CzyPierwszyRaz>
  <Oswiadczenie>tak<Oswiadczenie>
"""
"""class PostData(models.Model):    
    class Meta:
        verbose_name = _("Dane z formularza")
        verbose_name_plural = _("Dane z formularza")

    key = models.CharField(_("Klucz"),  max_length=1024)
    value = models.CharField(_("Wartosc"),  max_length=1024)
    creation_date = models.DateField(_("Creation Date"), editable=False, auto_now_add=True)
    change_date = models.DateField(_("Change Date"), editable=False, auto_now=True)
    session_key = models.CharField(_("Sesja HTTP"),  max_length=1024)
    def __unicode__(self):
        return '%s %s[%s]' % (self.creation_date, self.key, self.value)

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
"""
class PostDataTemp(models.Model):
     class Meta:
        verbose_name = _("Dane tymczasowe]")
        verbose_name_plural = _("Dane tymczasowe")

     value = models.CharField(_("Dane"),  max_length=4096)
     creation_date = models.DateField(_("Creation Date"), editable=False, auto_now_add=True)
     change_date = models.DateField(_("Change Date"), editable=False, auto_now=True)
     def __unicode__(self):
         return '%s [%s]' % (self.creation_date, self.value)

class PostDataTempArch(models.Model):
     class Meta:
        verbose_name = _("Dane zarchiwizowane")
        verbose_name_plural = _("Dane zarchiwizowane")
     value = models.CharField(_("Dane"),  max_length=4096)
     creation_date = models.DateField(_("Creation Date"), editable=False, auto_now_add=True)
     change_date = models.DateField(_("Change Date"), editable=False, auto_now=True)
     def __unicode__(self):
         return '%s [%s]' % (self.creation_date, self.value)

class UserProfile(models.Model):

    class Meta:
        verbose_name = _("Gość")
        verbose_name_plural = _("Goście")
    
    user = models.ForeignKey(User, unique=True, related_name='profile')   
    first_time = models.BooleanField(_("Nowy?"), default=True)
    age = models.IntegerField(_("Wiek"), null=True, blank=True)
    city = models.CharField(_("Miasto"), max_length=1024, null=True, blank=True)
    phone = models.CharField(_("Telefon"), max_length=1024, null=True, blank=True)
    
    def last_name(self):
        return self.user.last_name

    def first_name(self):
        return self.user.first_name

    def email(self):
        return self.user.email   

    def money(self):
        _money = 0
        for payment in self.user.payments.all():
            _money += payment.money
        return _money
    
    def __unicode__(self):
        return '%s %s (%s)' % (self.user.last_name, self.user.first_name, self.user.email)
 

class Session(models.Model):

    class Meta:
        verbose_name = _("Sesja")
        verbose_name_plural = _("Sesje")

    start_date = models.DateField(_("Data rozpoczecia"))
    end_date = models.DateField(_("Data zakonczenia"))
    uid = models.IntegerField(max_length=100, null=True, blank=True, unique=True)
    regstart = models.DateTimeField(_("Start zapisow"), default="2000-01-01")
    regend = models.DateTimeField(_("Koniec zapisow"), default="2000-01-01")
    manualend = models.BooleanField(_("Zablokowana?"), default=True)
    maxcap = models.IntegerField(_("Max Ilosc"), null=True, blank=True)
    maxcapnew = models.IntegerField(_("Max % Nowych"), null=True, blank=True)
    creation_date = models.DateField(_("Creation Date"), editable=False, auto_now_add=True)
    change_date = models.DateField(_("Change Date"), editable=False, auto_now=True)
    created_by = models.ForeignKey(User, editable=False, null=True, blank=True)
    
    def __unicode__(self):
        return 'Sesja Nr %s' % (self.uid)

class Action(models.Model):

    class Meta:
        verbose_name = _("Akcja")
        verbose_name_plural = _("Akcje")

    name = models.CharField(_("Nazwa"), max_length=1024)
    topic = models.CharField(_("Temat emaila"), max_length=1024, help_text="temat wysyłanego emaila, jeżeli nie chcesz wysyłać emaila, zostaw pusty", null=True, blank=True)
    email = models.EmailField(_("Adres email"), help_text="adres z jakiego nadchodzić będzie email")
    status = models.CharField(_("Nowy status"), max_length=1024, null=True, blank=True, choices=STATUSES)
    required_status = models.CharField(_("Wymagany status"), max_length=1024, null=True, blank=True, choices=STATUSES)
    text = models.TextField(_("Treść maila"), null=True, blank=True)

    creation_date = models.DateField(_("Creation Date"), editable=False, auto_now_add=True)
    change_date = models.DateField(_("Change Date"), editable=False, auto_now=True)
    created_by = models.ForeignKey(User, editable=False, null=True, blank=True)
    
    def __unicode__(self):
        return 'Akcja: %s' % unicode(self.name)

    def _make_action(self):
        def _set_status_wrapper(modeladmin, request, queryset):
            for application in queryset:
                if not self.required_status or application.status == self.required_status:
                    if self.status:
                        application.status = self.status
                        application.save()
                    if self.topic and self.text:
                        application.send(self.email, self.topic, self.text)
        _set_status_wrapper.short_description = self.name
        _set_status_wrapper.description = self.topic
        _set_status_wrapper.__name__ = "_action_%s" % self.pk
        return _set_status_wrapper
    
    @classmethod
    def get_actions(cls):
        action_objs = cls.objects.all()
        return map(lambda obj: obj._make_action(),action_objs)


class UserApplication(models.Model):

    class Meta:
        verbose_name = _("Zgłoszenie")
        verbose_name_plural = _("Zgłoszenia")

    user = models.ForeignKey(User, related_name='requests')
    session = models.ForeignKey('Session', related_name='applications', null=True, blank=True)
    start_date = models.DateField(_("Data przyjazdu"), null=True, blank=True)
    start_time = models.IntegerField(_("Godzina przyjazdu"), null=True, blank=True)
    end_date = models.DateField(_("Data wyjazdu"), null=True, blank=True)
    end_time = models.IntegerField(_("Godzina wyjazdu"), null=True, blank=True)
    first_time = models.BooleanField(_("Nowy?"), default=True)
    declaration = models.BooleanField(_("Oświadczenie"), default=True)
    rules_accept = models.BooleanField(_("Akceptacja Regulaminu"), default=True)
    email_accept = models.BooleanField(_("Email Informacje"), default=True)
    status = models.CharField(_("Status"), max_length=1024, null=True, blank=True, choices=STATUSES, default='new')

    creation_date = models.DateTimeField(_("Data zgłoszenia"), editable=False, auto_now_add=True)
    change_date = models.DateTimeField(_("Data ostatniej modyfikacji"), editable=False, auto_now=True)
    created_by = models.ForeignKey(User, editable=False, null=True, blank=True)
    session_key = models.CharField(_("Sesja HTTP"), editable=False, max_length=1024)

    def send(self, email, topic, text):
        _template = get_template_from_string(text)
        email_text = _template.render(Context({ 'application': self, 'user': self.user, 'session': self.session}))
#        print "======================================================================"
#        print "email: %s" % email
#        print "topic: %s" % topic
#        print "text: %s" % email_text
#        print "======================================================================"
        self.user.email_user(topic, email_text, email)

class UserPayment(models.Model):

    class Meta:
        verbose_name = _("Wplata")
        verbose_name_plural = _("Wplaty")

    user = models.ForeignKey(User, related_name='payments')
    money = models.PositiveIntegerField(_("Wpłacona kwota"))
    date = models.DateField(_("Data wpłaty"), auto_now_add=True)
    
    creation_date = models.DateField(_("Creation Date"), editable=False, auto_now_add=True)
    change_date = models.DateField(_("Change Date"), editable=False, auto_now=True)
    created_by = models.ForeignKey(User, editable=False, null=True, blank=True)
