from django import forms


class SignForm(forms.Form):
    operation = forms.CharField(max_length=120)
    username = forms.CharField(max_length=120)
    password = forms.CharField(max_length=120)
    email = forms.CharField(max_length=120)
    favorite = forms.CharField(max_length=120)
    completed = forms.BooleanField()
