'''
Created on 22-10-2012

@author: beret
'''

import hotshot
import os
import time


try:
    import settings
    PROFILE_LOG_BASE = settings.PROFILE_LOG_BASE
    PROFILE_LOG_NAME = settings.PROFILE_LOG_NAME
except:
    PROFILE_LOG_BASE = "/tmp"
    PROFILE_LOG_NAME = "_profile.log"


def profile(log_file=PROFILE_LOG_NAME):
    """Profile some callable.
    
    It was be previous for django deticated but I change there some for more universal

    This decorator uses the hotshot profiler to profile some callable (like
    a view function or method) and dumps the profile data somewhere sensible
    for later processing and examination.

    It takes one argument, the profile log name. If it's a relative path, it
    places it under the PROFILE_LOG_BASE. It also inserts a time stamp into the 
    file name, such that 'my_view.prof' become 'my_view-20100211T170321.prof', 
    where the time stamp is in UTC. This makes it easy to run and compare 
    multiple trials.     
    """

    if not os.path.isabs(log_file):
        log_file = os.path.join(PROFILE_LOG_BASE, log_file)

    def _outer(f):
        def _inner(*args, **kwargs):
            # Add a timestamp to the profile output when the callable
            # is actually called.
            (base, ext) = os.path.splitext(log_file)
            base = base + "-" + time.strftime("%Y%m%dT%H%M%S", time.gmtime())
            final_log_file = base + ext

            prof = hotshot.Profile(final_log_file)
            try:
                ret = prof.runcall(f, *args, **kwargs)
            finally:
                prof.close()
            return ret

        return _inner
    return _outer

if __name__ == '__main__':
    pass