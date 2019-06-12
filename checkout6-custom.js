(addPackingOnCart = function(){
	let isPacking = [];
	function addPackingToCart(){
		let _this = $('.addPackingToCart');
		if($(_this).hasClass('added'))return;
		$(_this).addClass('isloading');
		let idsku = _this.attr('data-id');
		let product = [{id:idsku, quantity:1, seller:1}];
		vtexjs.checkout.addToCart(product).done(function(){
			setTimeout(function(){
				$(_this).removeClass('isloading').addClass('added');
			},1000);
		}).fail(function(){
			setTimeout(function(){
				$(_this).removeClass('isloading');
			},1000);
		});
	}
	document.addEventListener('DOMContentLoaded', function (e) {
		$('.table.cart-items').parent().append(
			'<input type="radio" id="addPacking" name="packing">'+
			'<input type="radio" id="remPacking" name="packing" checked="true">'+
			'<div class="addpacking"><span>Adicionar embalagem térmica?</span>'+
				'<label for="addPacking">Sim, quero cuidar bem do meu Dengo.</label>'+
				'<label for="remPacking">Não, não quero a embalagem trémica.</label>'+
			'</div>'+
			'<span>RECOMENDAMOS ADICIONAR A EMBALAGEM TÉRMICA NO SEU PEDIDO, PARA PROTEGER E CONSERVAR MELHOR OS SEUS DENGOS!</span>'+
			'<table class="selectpacking isloading"><tbody>'+
			'<tr>'+
				'<td> <img height="45" width="45" src="//eplus.vteximg.com.br/arquivos/ids/155355-55-55/eplus-capa-008.jpg?v=635957104541630000" alt="Pacote Design 01" id="product-image-40"> </td>'+
				'<td class="productName"><a>Embalagem térmica</a><span class="brandName">marca</span></td>'+
				'<td><span class="packingPrice">R$ 12,00</span></td>'+
				'<td><button>Adicionar</button></td>'+
			'</tr>'+
			'</tbody></table>'
		);
		$('body').on('click', '.item-link-remove' ,function(){
			let id = $(this).attr('id');
			id = id.substring((id.lastIndexOf('-')+1));
			let indexId = isPacking.indexOf(id);
			if(indexId!==-1){
				isPacking.splice(indexId,1);
			}
			$('.addPackingToCart[data-id="'+id+'"]').removeClass('added');
			$('label[for="remPacking"]').trigger('click');
		});
		$(window).on('orderFormUpdated.vtex',function(e,orderform){
			orderform.items.find(function(item){
				if(item.id=='40'){
					isPacking.push(item.id);
				}
			});
		});
		window.onload = function(){
			console.log('load cart')
			$.ajax({
				crossDomain:true,
				type:'GET',
				url:'/api/catalog_system/pub/products/search/?fq=skuId:40',/*178*/
				success: function(d){
					let formartPrice = function(int){
						/*var tmp = int+'';
						tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
						if( tmp.length > 6 )
							tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
						return 'R$ '+tmp;*/
						return 'R$ '+int.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
					};
					let id = d[0].items[0].itemId,
					imageUrl = d[0].items[0].images[0].imageUrl,
					productName = d[0].productName,
					brand = d[0].brand,
					price = d[0].items[0].sellers[0].commertialOffer.Price;
					$('table.selectpacking tbody').html(
						'<tr>'+
							'<td> <img height="45" width="45" src="'+imageUrl+'" alt="'+productName+'"> </td>'+
							'<td class="productName"><a>'+productName+'</a><span class="brandName">'+brand+'</span></td>'+
							'<td><span class="packingPrice">Por: '+formartPrice(price)+'</span></td>'+
							'<td><button class="addPackingToCart '+(isPacking.indexOf(id)!==-1?'added':'')+'" data-id="'+id+'">Adicionar</button></td>'+
						'</tr>'
					).parent().removeClass('isloading');
					$('body').on('click','.addPackingToCart',function(){
						addPackingToCart();
					});
				},
				error: function(err){
					console.log(err)
				}
			});
		}
	}, false);
})();

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
	$(document).on("click", "#go-to-shipping, #go-to-payment", function(e){
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