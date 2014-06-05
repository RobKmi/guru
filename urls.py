from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

#from django.views.generic.simple import redirect_to
from django.views.generic import RedirectView

urlpatterns = patterns('',
	# Examples:
	url(r'^$', RedirectView.as_view(url='/admin/users/userapplication/')),
	# url(r'^/', include('foo.urls')),
	
	# Uncomment the admin/doc line below to enable admin documentation:
	url(r'^admin/doc/', include('admindocs.urls')),

	# Uncomment the next line to enable the admin:
	url(r'^admin/', include(admin.site.urls)),
	url(r'^create_app/', 'users.views.create_app'),
        url(r'^submit_app/', 'users.views.submit_app'),
	#url(r'^form/', 'users.views.form')
	url(r'^dodaj/$', 'users.views.externform'),
	url(r'^odswiez/$', 'users.views.loadnewapps')

)
