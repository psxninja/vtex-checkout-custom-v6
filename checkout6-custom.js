/* CELULAR E DATA DE NASCIMENTO */
var campoData = '<p class="date-birthday client-date-birthday input pull-left text required"><label for="client-datebirthday">Data de Nascimento</label><input type="date" id="client-datebirthday" onkeypress="mascaraData2(this)" placeholder="11/11/1111" /></p>';
var campoCellphone = '<p class="datev-cellphone clientv-cellphone input pull-left text required"><label for="clientv-cellphone">Celular</label><input type="text" id="clientv-cellphone" /></p>';
var error = '<span class="help error>Campo obrigatório.</span>';
function getFromMasterData(name, where, birthDate){  
	$.ajax({
		"async": true,
		"crossDomain": true,
		"url": '/api/dataentities/' + name + '/search?_where=' + where + '&_fields=birthDate,celular',
		"method": "GET",
		"headers": {
			"Content-Type": "application/json",
			"Accept": "application/vnd.vtex.ds.v10+json"
		}
	}).done(function(data){
		let response = data[0],
		hbd = response.birthDate,
		celu = response.celular;
		if(hbd == null){
			/*console.log("Este cliente não possui data de nascimento cadastrada.");*/
		} else {
			/*console.log("Este cliente já possui data de nascimento cadastrada.");*/
			$(".date-birthday").addClass("hide");
		}
		if(celu == null){
			/*console.log("Este cliente não possui celular cadastrado.");*/
		} else {
			/*console.log("Este cliente já possui data celular.");*/
			$(".clientv-cellphone").addClass("hide");
		}
	}).fail(function(data) {
		/*console.log("deu um erro");*/
	});
	/*return response;*/
}
var birthDate;
function setBirthday(entidade, email, ccellphone, birthDate) {
	/*formatando a data*/
	let birthDateAux = birthDate.split("-"),
	/*dia = birthDate[2];*/
	mes = birthDateAux[1],
	/*ano = birthDate[0]; 
	birthDate = dia+"/"+mes+"/"+ano;*/
	dataa;
	if(birthDate){
		dataa = JSON.stringify({ 
			"email": email,
			"birthDate": birthDate,
			"celular": ccellphone
		});
	}else{
		dataa = JSON.stringify({ 
			"email": email,
			"celular": ccellphone
		});
	}
	$.ajax({
		"async": true,
		"crossDomain": true,
		"url" : "/api/dataentities/CL/documents",
		"type": 'PATCH',
		"headers": {
			"Content-Type": "application/json",
			"Accept": "application/vnd.vtex.ds.v10+json"
		},
		"dataType": "json",
		"processData": false,
		"data": dataa,
	}).done(function(response){
		/*console.log("Data inserida com sucesso.", response);*/
	}).fail(function(response){
		/*console.log("Ocorreu um erro na inserção da data de nascimento.", response);*/
	});
}
var entidade;
var birthDate;
var email;
$(window).load(function(){
	$("#client-phone").parent(".client-phone").parent("div").after(campoData);
	$(".client-document").last().after(campoCellphone);
	if( $(".client-pre-email").css('display') == 'none' ){
		/*console.log("campo oculto");
		definir as informações de query no banco*/
		entidade = "CL";
		birthDate = $("#client-datebirthday").val();
		email = $("input#client-pre-email").val(); 
		email = "email=" + email;
		getFromMasterData(entidade, email, 'birthDate');
	} else {
		$(document).on("click", "#btn-client-pre-email", function (event) {
		entidade = "CL";
		birthDate = $("#client-datebirthday").val();
		email = $("input#client-pre-email").val(); 
		email = "email="+email;
		getFromMasterData(entidade, email, 'birthDate');
		});
	}
});
/*jQuery(document).on("click", "#go-to-shipping, #go-to-payment", function (event) {
	if(!$(".date-birthday").hasClass("hide")){
		let birthDate = $("#client-datebirthday").val(),
		email = $("input#client-pre-email").val(),
		entidade = "CL";
		if(birthDate == "") {
			$(".date-birthday .help.error").remove();
			$(".client-date-birthday").append(error);
			$("#client-datebirthday").addClass("error");
			event.preventDefault();
		} else {
			$(".date-birthday .help.error").remove();
			$("#client-datebirthday").removeClass("error");
			setBirthday(entidade, email, ccellphone, birthDate);
		}
	}
	if(!$(".clientv-cellphone").hasClass("hide")){
		let ccellphone = $("#clientv-cellphone").val(),
		email = $("input#client-pre-email").val(),
		entidade = "CL";
		if(ccellphone == "") {
			$(".clientv-cellphone .help.error").remove();
			$(".clientv-cellphone").append(error);
			$("#clientv-cellphone").addClass("error");
			event.preventDefault();
		} else {
			$(".clientv-cellphone .help.error").remove();
			$("#clientv-cellphone").removeClass("error");
			setBirthday(entidade, email, ccellphone, birthDate);
		}
	}
});*/