$.validator.setDefaults({
	submitHandler: function(form) { 
		//alert("submitted!");
		myLoader.show();
		form.submit();
	}
});

$().ready(function() {

	// validate signup form on keyup and submit
	$("form").validate({
		rules: {
			Imie: {
				required: true,
				minlength: 2
			},
			Nazwisko: {
				required: true,
				minlength: 2
			},
			Miasto: {
				required: true,
				minlength: 2
			},
			EMail: {
				required: true,
				email: true
			},
			Wiek:	"required",
			Telefon: {
				required: true,
				minlength: 7
			},
			AkceptacjaRegulaminu: "required"
		},
		messages: {
			Imie: {
				required: "Proszę podać imię",
				minlength: "Imię musi mieć co najmniej 2 znaki"
			},
			Nazwisko: {
				required: "Proszę podać nazwisko",
				minlength: "Nazwisko musi mieć co najmniej 2 znaki"
			},
			Miasto: {
				required: "Proszę podać miasto",
				minlength: "Nazwa miasta musi mieć co najmniej 2 znaki"
			},
			EMail: {
				required: "Proszę podać adres e-mail",
				minlength: "Nieprawidłowy format adresu e-mail"
			},
			Wiek:	"Proszę podać wiek",
			Telefon: {
				required: "Proszę podać numer telefonu",
				minlength: "Numer telefonu musi mieć co najmniej 7 znaków"
			},
			AkceptacjaRegulaminu: "Akceptacja regulaminu jest obowiązkowa"
		}
	});
});
