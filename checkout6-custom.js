(dataNascimento = function(){
	/* CELULAR E DATA DE NASCIMENTO */
	var campoData = '<p class="date-birthday client-date-birthday input pull-left text required"><label for="client-datebirthday">Data de Nascimento</label><input type="date" id="client-datebirthday" onkeypress="mascaraData2(this)" placeholder="11/11/1111" /></p>',
	campoCellphone = '<p class="datev-cellphone clientv-cellphone input pull-left text required"><label for="clientv-cellphone">Celular</label><input type="text" id="clientv-cellphone" /></p>',
	error = '<span class="help error>Campo obrigatório.</span>';
	function getFromMasterData(email){  
		$.ajax({
			"async": true,
			"crossDomain": true,
			"url": '/api/dataentities/CL/search?_where=email='+email+'&_fields=birthDate,celular',
			"method": "GET",
			"headers": {
				"Content-Type": "application/json",
				"Accept": "application/vnd.vtex.ds.v10+json"
			}
		}).done(function(data){
			let response = data[0],
			hbd = response.birthDate,
			celu = response.celular;
			if(hbd !== null){
				/*console.log("Este cliente já possui data de nascimento cadastrada.");*/
				$(".date-birthday").addClass("hide");
			}else{
				/*console.log("Este cliente não possui data de nascimento cadastrada.");*/
			}
			if(celu == null){
				/*console.log("Este cliente não possui celular cadastrado.");*/
			}else{
				/*console.log("Este cliente já possui data celular.");*/
				$(".clientv-cellphone").addClass("hide");
			}
		}).fail(function(data) {
			/*console.log("deu um erro");*/
		});
		/*return response;*/
	}
	var birthDate;
	function setBirthday(email, ccellphone, birthDate) {
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
		}).done(function(res){
			/*console.log("Data inserida com sucesso.", res);*/
		}).fail(function(res){
			/*console.log("Ocorreu um erro na inserção da data de nascimento.", res);*/
		});
	}
	var entidade,birthDate,email;
	$(window).load(function(){
		$("#client-phone").parent(".client-phone").parent("div").after(campoData);
		$(".client-document").last().after(campoCellphone);
		if( $(".client-pre-email").css('display') == 'none' ){
			/*console.log("campo oculto");*/
			email = $("input#client-pre-email").val();
			getFromMasterData(email);
		}else{
			$('body').on("click", "#btn-client-pre-email", function(e){
				email = $("input#client-pre-email").val();
				getFromMasterData(email);
			});
		}
	});
	Jquery(document).on("click", "#go-to-shipping, #go-to-payment", function(e){
		if(!$(".date-birthday").hasClass("hide")){
			let birthDate = $("#client-datebirthday").val(),
			email = $("input#client-pre-email").val();
			if(birthDate == "") {
				$(".date-birthday .help.error").remove();
				$(".client-date-birthday").append(error);
				$("#client-datebirthday").addClass("error");
				e.preventDefault();
			} else {
				$(".date-birthday .help.error").remove();
				$("#client-datebirthday").removeClass("error");
				setBirthday(email, ccellphone, birthDate);
			}
		}
		if(!$(".clientv-cellphone").hasClass("hide")){
			let ccellphone = $("#clientv-cellphone").val(),
			email = $("input#client-pre-email").val();
			if(ccellphone == "") {
				$(".clientv-cellphone .help.error").remove();
				$(".clientv-cellphone").append(error);
				$("#clientv-cellphone").addClass("error");
				e.preventDefault();
			} else {
				$(".clientv-cellphone .help.error").remove();
				$("#clientv-cellphone").removeClass("error");
				setBirthday(email, ccellphone, birthDate);
			}
		}
	});
})();