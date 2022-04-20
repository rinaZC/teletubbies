from django.shortcuts import render
from django.shortcuts import redirect
from rest_framework import viewsets
from .serializers import AccountsSerializer
from .models import Accounts
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)


# Create your views here.


class AccountsView(viewsets.ModelViewSet):
    serializer_class = AccountsSerializer
    queryset = Accounts.objects.all()

    def create(self, request, *args, **kwargs):
        if request.data.get('operation') == 'create':
            if sign_up(request):
                return JsonResponse({'result': 'Success',
                                     'message': 'Sign up successfully! Redirect to Login page...'}, status=200)
            else:
                return JsonResponse({'result': 'Failed',
                                     'message': 'Account creation failed. Already existed !!!'}, status=201)

        elif request.data.get('operation') == 'login':
            if request.session.get('username'):
                return JsonResponse({'result': 'Success',
                                     'message': 'Already login! Redirect to Main page...'}, status=200)
            elif login(request):
                return JsonResponse({'result': 'Success',
                                     'message': 'Login successfully! Redirect to Main page...',
                                     'id': request.session.get('id')}, status=200)
            else:
                return JsonResponse({'result': 'Failed',
                                     'message': 'Login Failed! Cannot find correct username or password. '
                                                'Maybe sign up first?'}, status=201)
        elif request.data.get('operation') == 'logout':
            if logout(request):
                msg = "Account: " + request.data.get('username') + " logout successfully! Redirect to Login page..."
                return JsonResponse({'result': 'Success',
                                     'message': msg}, status=200)
            else:
                return JsonResponse({'result': 'Failed',
                                     'message': 'Session not find.'}, status=201)

        elif request.data.get('operation') == 'edit':
            if request.session.get('username'):
                if edit_user(request):
                    return JsonResponse({'result': 'Success',
                                         'message': 'Profile Update Success !'}, status=200)
                else:
                    return JsonResponse({'result': 'Failed',
                                         'message': 'Incorrect Account !!!'}, status=201)
            else:
                return JsonResponse({'result': 'Failed',
                                     'message': 'Incorrect Account !!!'}, status=201)

        else:
            return JsonResponse({'result': 'Failed',
                                 'message': 'Unrecognized account operation !!!'}, status=201)


def sign_up(request):
    name = request.data.get('username')
    if Accounts.objects.filter(username=name).exists():
        return False
    else:
        add_to_action = Accounts.objects.create(username=name, password=request.data.get('password'),
                                                email=request.data.get('email'),
                                                favorite=request.data.get('favorite'),
                                                completed=request.data.get('completed'))
        add_to_action.save()
        return True


def login(request):
    name = request.data.get('username')
    password = request.data.get('password')
    _vals = {'username': name, 'password': password}
    if Accounts.objects.filter(**_vals):
        request.session['username'] = name
        user = Accounts.objects.get(username=name)
        request.session['id'] = user.id
        return True
    else:
        return False


def logout(request):
    if request.session.get('username'):
        del request.session['username']
        return True
    else:
        return False


def edit_user(request):
    user_id = request.data.get('owner')
    favorite = request.data.get('favorite')
    bios = request.data.get('bios')
    pronouns = request.data.get('pronouns')
    artist = request.data.get('artist')

    account_obj = Accounts.objects.filter(pk=user_id)
    if account_obj:
        account_obj.update(favorite=favorite, bios=bios, pronouns=pronouns, artist=artist)
        return True
    else:
        return False
