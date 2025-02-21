
var buyXgetY = window.buyXgetY || {};
(function($){
	/*-----------------------------------------------------------------------------------*/
	/* BUY X GET Y
	/*-----------------------------------------------------------------------------------*/
	buyXgetY = {
		// Haravan_Promotion
		init: function(){
			if (typeof $.jStorage  == 'undefined') {
				var script = document.createElement('script');
				script.type = "text/javascript";
				script.src = "//cdnjs.cloudflare.com/ajax/libs/json2/20160511/json2.min.js";
				document.getElementsByTagName('head')[0].appendChild(script);
				var script2 = document.createElement('script');
				script2.type = "text/javascript";
				script2.src = "//cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.12/jstorage.min.js";
				document.getElementsByTagName('head')[0].appendChild(script2);
			}
			hrvPromotionInited = false;
			window.HaravanPromotionAsyncInit = function() {
				hrvPromotionInited = true;
				if(typeof(buyXgetY.getPromotionRecommended) == 'function'){
					var idProduct = $('#buyxgety-product-list').data('id'),
							idTitle = $('#buyxgety-product-list').data('title');
					if(idProduct != undefined && idTitle != undefined){
						buyXgetY.getPromotionRecommended(idProduct,idTitle); 
					}// render list sp tặng/giảm
				}
				if(typeof(buyXgetY.showGiftLabel) == 'function')
					buyXgetY.showGiftLabel();
			}
		},
		getPromotionRecommended: function(id,title){// truyền id, tên sản phẩm chính lấy từ product
			buyXgetY.check_getRecommendeds = false;
			var self = this;
			var img_empty = 'https://file.hstatic.net/1000308580/file/icon-gifbox_21127e78739a40a28f058e5e123d41b1.png';
			$.get('https://buyxgety-omni.haravan.com/js/recommendeds?product_id='+id)
				.done(function(result) {
				// success
				if ( result.recommendeds.length > 0 ) {
					buyXgetY.check_getRecommendeds = true;
					var checkAvailable = [];
					$.each(result.recommendeds,function(i,v){
						checkAvailable.push(v.product_id);
					});
					var checkAvail = null;
					var strCheckAvailable = "(id:product="+checkAvailable.join(')||(id:product=')+')';
					var imgFinal = '';
					$.get('/search?q=filter=(('+strCheckAvailable+')&&(available:product=true))&view=datacombo').done(function(checkGift){
						checkAvail = JSON.parse(checkGift);
						if($.isEmptyObject(checkAvail)){
							$('#buyxgety-program').html("Xin lỗi! Các sản phẩm quà tặng đã hết. Hẹn bạn vào lần khuyến mãi tới nhé!");
						}
						else{
							var is_xy_first = 0;
							var count_unavailable = 0;
							$.each(result.recommendeds,function(i,v){
								if(v.product_id == id) imgFinal = v.product_images[0];
								if(checkAvail.hasOwnProperty(v.product_id)){
									if(checkAvail[v.product_id].available){
										var html2 = '';

										if(v.is_apply_variant == false){
											var html ='<div class="buyxgety_item">';
											html+=  '<div class="buyxgety_checkbox">'
											html+=    '<input class="radio-product" data-applyvariant="'+v.is_apply_variant+'" data-id="'+v.variant_ids[0]+'" data-percent="'+v.percent+'" data-countbuy="'+v.quantity+'" data-countgift="'+v.apply_quantity+'"' + (is_xy_first == 0 ? 'checked="checked"':'') +' type="radio" name="group-product-sale">';
											html+=  '</div>';
											html+=  '<div class="buyxgety_image">';
											html+=	  '<a href="/products/'+ v.product_handle +'" target="_blank">';
											if(v.product_images.length > 0){
												html+=      '<img width="150" src="'+v.product_images[0]+'" alt="item 1"/>';
											}
											else{
												html+=      '<img class="img_empty" src="'+img_empty+'" alt="item 1"/>';
											}
											html+=    '</a>';
											html+=  '</div>';
											html+=  '<div class="buyxgety_item_title">';
											html+=			'<p class="bxy__tt1">';
											if (v.type == 3 || v.percent == 100) {
												html+=			'<span>Tặng '+ v.apply_quantity +'</span>';
												html+=	    'sản phẩm <a href="/products/' + v.product_handle  + '" target="_blank">' + v.product_name + '.</a>';
											} 
											else {
												html+=			'<span>Giảm '+ (v.percent != null ? (v.percent + "%") : Haravan.formatMoney(v.amount*100, formatMoney)) +'</span>';
												html+=    	'sản phẩm <a href="/products/' + v.product_handle  + '" target="_blank">' + v.product_name + '.</a>';
											}
											html+=			'</p>';
											html+= 	  	'<p class="bxy__tt2">';
											html+= 		  	'Khi mua <strong>' + v.quantity + '</strong><span> ' + title + '</span>';
											html+=    	'</p>';
											html+=  	'</div>';
											html+=  '</div>';
											$('#detail-product #buyxgety-product-list > .buyxgety_content > .buyxgety_lists').append(html);
										}
										else{
											$.each(v.apply_variants,function(i2,v2){											
												var checkvariant = checkAvail[v.product_id].variants[v2.variant_id].available;
												if (checkvariant){
													var title_variant = v2.title.replace('/','-');
													var html ='<div class="buyxgety_item">';
													html+=  '<div class="buyxgety_checkbox">'
													html+=    '<input class="radio-product" data-applyvariant="'+v.is_apply_variant+'" data-id="'+v2.variant_id+'" data-percent="'+v2.percent+'" data-countbuy="'+v2.quantity+'" data-countgift="'+v2.apply_quantity+'"' + (is_xy_first == 0? 'checked="checked"':'') +' type="radio" name="group-product-sale">';
													html+=  '</div>';
													html+=  '<div class="buyxgety_image">';
													html+=	  '<a href="/products/'+ v.product_handle +'?variant='+v2.variant_id+'" target="_blank">';
													if(v.product_images.length > 0){
														html+=      '<img width="60" src="'+v.product_images[0]+'" alt="item 1"/>';
													}
													else{
														html+=      '<img width="60" class="img_empty" src="'+img_empty+'" alt="item 1"/>';
													}
													html+=    '</a>';
													html+=  '</div>';
													html+=  '<div class="buyxgety_item_title">';
													html+= 	  '<p style="margin-bottom:0px;">';
													html+= 		  'Khi mua <strong style="color:#f51e1e;">' + v2.quantity + '</strong><span style="color:#315399;"> ' + title + '</span><br> ';
													
													if (v2.type == 3 || v2.percent == 100) {
														html+= 		'Tặng <strong style="color:#f51e1e;"> ' + v2.apply_quantity + '</strong><a href="/products/' + v.product_handle  + '" target="_blank" style="color:#315399;"> ' + v.product_name +' - '+v2.title + '</a>. ';
													} 
													else {
														html+=    'Giảm <strong style="color:#f51e1e;">' + (v2.percent != null ? (v2.percent + "%") : Haravan.formatMoney(v2.amount*100, formatMoney)) + '</strong> ';
														html+=    ' sản phẩm <a href="/products/' + v.product_handle  + '?variant='+v2.variant_id+'" target="_blank" style="color:#315399;">' + v.product_name + ' - '+v2.title + '.</a>';
													}
													html+=    '</p>';
													html+=  '</div>';
													html+='</div>';
													$('#detail-product #buyxgety-product-list > .buyxgety_content > .buyxgety_lists').append(html);
													is_xy_first++;
												}
											});
										}	
										is_xy_first++;
									}
									else{
										count_unavailable++;
									}
								}
							});
							
							if(count_unavailable > 0 && count_unavailable == result.recommendeds.length){
								$('#detail-product .buyxgety-product-list #buyxgety-program').html("Xin lỗi! Các sản phẩm quà tặng đã hết. Hẹn bạn vào lần khuyến mãi tới nhé!");
							}
							else{
								var imgFinal = $('.productList-slider li:eq(0) img').attr('src') || '';
								if(imgFinal == '' && $('#productCarousel-thumb .owl-item').length == 0){
									imgFinal = $('.imagepicture img').attr('src');
								}
								var htmlFinal = '<div class="buyxgety_item specOption">';
										htmlFinal +=  '<div class="buyxgety_checkbox"><input class="radio-product not_gift" type="radio" name="group-product-sale"></div>';
										htmlFinal +=  '<div class="buyxgety_image"><img width="150" src="'+imgFinal+'" alt="'+title+'"/></div>';
										htmlFinal +=  '<div class="buyxgety_item_title">Chỉ mua <span style="color:#315399;">'+title+'</span></div>';
										htmlFinal += '</div>';
								//$('#detail-product #buyxgety-product-list > .buyxgety_content > .buyxgety_lists').append(htmlFinal);
							}
						}
						$('#buyxgety-program').removeClass('d-none');
						$('#add-to-cart,#add-to-cartbottom,#buy-now,#add-to-cart-2,#buy-now-2').removeClass('loading');
					});
				}
				else{
					$('#add-to-cart').length > 0  ? $('#add-to-cart,#add-to-cartbottom,#buy-now,#add-to-cart-2,#buy-now-2').removeClass('loading') : null;
				}
			})
				.fail(function() {
				// error
			})
				.always(function() {
				// always
				$('#add-to-cart,#add-to-cartbottom,#buy-now,#add-to-cart-2,#buy-now-2').removeClass('loading');
			});
		},	
		getQuickPromotionRecommended: function(id,title){// truyền id, tên sản phẩm chính lấy từ product
			buyXgetY.check_getRecommendeds = false;
			var self = this;
			$.get('https://buyxgety-omni.haravan.com/js/recommendeds?product_id='+id)
				.done(function(result) {
				// success
				if ( result.recommendeds.length > 0 ) {
					buyXgetY.check_getRecommendeds = true;
					var checkAvailable = [];
					$.each(result.recommendeds,function(i,v){
						checkAvailable.push(v.product_id);
					});
					var checkAvail = null;
					var strCheckAvailable = "(id:product="+checkAvailable.join(')||(id:product=')+')';
					$.get('/search?q=filter=(('+strCheckAvailable+')&&(available:product=true))&view=datacombo').done(function(checkGift){
						checkAvail = JSON.parse(checkGift);
						if($.isEmptyObject(checkAvail)){
							$('.q-selector-buyxgety #buyxgety-program').html("Xin lỗi! Các sản phẩm quà tặng đã hết. Hẹn bạn vào lần khuyến mãi tới nhé!");
						}
						else{
							var is_xy_first = 0;
							var count_unavailable = 0;
							$.each(result.recommendeds,function(i,v){
								if(checkAvail.hasOwnProperty(v.product_id)){
									if(checkAvail[v.product_id].available){
										var html2 = '';

										if(v.is_apply_variant == false){
											var html ='<div class="buyxgety_item">';
											html+=  '<div class="buyxgety_checkbox">'
											html+=    '<input class="radio-product" data-applyvariant="'+v.is_apply_variant+'" data-id="'+v.variant_ids[0]+'" data-percent="'+v.percent+'" data-countbuy="'+v.quantity+'" data-countgift="'+v.apply_quantity+'"' + (is_xy_first == 0 ? 'checked="checked"':'') +' type="radio" name="group-product-sale">';
											html+=  '</div>';
											html+=  '<div class="buyxgety_image">';
											html+=	  '<a href="/products/"'+ v.product_handle +'"target="_blank">';
											html+=      '<img width="60" src="'+v.product_images[0]+'" alt="item 1"/>';
											html+=    '</a>';
											html+=  '</div>';
											html+=  '<div class="buyxgety_item_title">';
											html+=			'<p class="bxy__tt1">';
											if (v.type == 3 || v.percent == 100) {
												html+=			'<span>Tặng '+ v.apply_quantity +'</span>';
												html+=	    'sản phẩm <a href="/products/' + v.product_handle  + '" target="_blank">' + v.product_name + '.</a>';
											} 
											else {
												html+=			'<span>Giảm '+ (v.percent != null ? (v.percent + "%") : Haravan.formatMoney(v.amount*100, "")) +'</span>';
												html+=    	'sản phẩm <a href="/products/' + v.product_handle  + '" target="_blank">' + v.product_name + '.</a>';
											}
											html+=			'</p>';
											html+= 	  	'<p class="bxy__tt2">';
											html+= 		  	'Khi mua <strong>' + v.quantity + '</strong><span> ' + title + '</span>';
											html+=    	'</p>';
											html+=  	'</div>';
											html+=  '</div>';
											htmlQvApp += html;
											$('.q-selector-buyxgety #buyxgety-product-list > .buyxgety_content > .buyxgety_lists').append(html);
										}
										else{
											$.each(v.apply_variants,function(i2,v2){	
												var checkvariant = checkAvail[v.product_id].variants[v2.variant_id].available;
												if (checkvariant){
													var title_variant = v2.title.replace('/','-');
													var html ='<div class="buyxgety_item">';
													html+=  '<div class="buyxgety_checkbox">'
													html+=    '<input class="radio-product" data-applyvariant="'+v.is_apply_variant+'" data-id="'+v2.variant_id+'" data-percent="'+v2.percent+'" data-countbuy="'+v2.quantity+'" data-countgift="'+v2.apply_quantity+'"' + (is_xy_first == 0? 'checked="checked"':'') +' type="radio" name="group-product-sale">';
													html+=  '</div>';
													html+=  '<div class="buyxgety_image">';
													html+=	  '<a href="/products/'+ v.product_handle +'?variant='+v2.variant_id+'" target="_blank">';
													if(v.product_images.length > 0){
														html+=      '<img width="60" src="'+v.product_images[0]+'" alt="item 1"/>';
													}
													else{
														html+=      '<img width="60" class="img_empty" src="'+img_empty+'" alt="item 1"/>';
													}
													html+=    '</a>';
													html+=  '</div>';
													html+=  '<div class="buyxgety_item_title">';
													html+= 	  '<p style="margin-bottom:0px;">';
													html+= 		  'Khi mua <strong style="color:#f51e1e;">' + v2.quantity + '</strong><span style="color:#315399;"> ' + title + '</span><br> ';
													if (v2.type == 3 || v2.percent == 100) {
														html+= 		'Tặng <strong style="color:#f51e1e;"> ' + v2.apply_quantity + '</strong><a href="/products/' + v.product_handle  + '" target="_blank" style="color:#315399;"> ' + v.product_name +' - '+v2.title + '</a>. ';
													} 
													else {
														html+=    'Giảm <strong style="color:#f51e1e;">' + (v2.percent != null ? (v2.percent + "%") : Haravan.formatMoney(v2.amount*100, formatMoney)) + '</strong> ';
														html+=    ' sản phẩm <a href="/products/' + v.product_handle  + '?variant='+v2.variant_id+'" target="_blank" style="color:#315399;">' + v.product_name + ' - '+v2.title + '.</a>';
													}
													html+=    '</p>';
													html+=  '</div>';
													html+='</div>';
													htmlQvApp += html;
													
													$('.q-selector-buyxgety #buyxgety-product-list > .buyxgety_content > .buyxgety_lists').append(html);
													is_xy_first++;
												}
											});
										}	
										is_xy_first++;
									}
									else{
										count_unavailable++;
									}
								}
							});
							
							if(count_unavailable > 0 && count_unavailable == result.recommendeds.length){
								$('.q-selector-buyxgety .buyxgety-product-list #buyxgety-program').html("Xin lỗi! Các sản phẩm quà tặng đã hết. Hẹn bạn vào lần khuyến mãi tới nhé!");
							}
							else{
								var imgFinal = $('#quickview-thumbproduct .owl-item:eq(0) img').attr('src');
								if($('#quickview-thumbproduct .owl-item').length == 0){
									imgFinal = $('#quickview-thumbproduct .product-thumb:eq(0) img').attr('src');
								}
								var htmlFinal = '<div class="buyxgety_item specOption">';
										htmlFinal +=  '<div class="buyxgety_checkbox"><input class="radio-product not_gift" type="radio" name="group-product-sale"></div>';
										htmlFinal +=  '<div class="buyxgety_image"><img width="60" src="'+imgFinal+'" alt="'+title+'"/></div>';
										htmlFinal +=  '<div class="buyxgety_item_title">Chỉ mua <span style="color:#315399;">'+title+'</span></div>';
										htmlFinal += '</div>';
								//$('.q-selector-buyxgety #buyxgety-product-list > .buyxgety_content > .buyxgety_lists').append(htmlFinal);
							}
						}

						$('#add-to-cartQuickview').removeClass('loading').addClass('add-xy');
						if(is_xy_first !== 0 || count_unavailable > 0) $('.q-selector-buyxgety').removeClass('d-none');
					});
				}
				else{
					($('#add-to-cartQuickview').length > 0 ) ? $('#add-to-cartQuickview').removeClass('loading') : null;
				}
			})
				.fail(function() {})
				.always(function() {
				$('#add-to-cartQuickview').removeClass('loading');
			});
		},
		addCartBuyXGetY_detail: function(is_accept,variant_id, product_id, quantity, title, buy_at, callback) {
			var self = this;
			var params = {
				quantity: quantity,
				id: variant_id
			};
			quantity = parseInt(quantity);
	//		var dom_parent = (buy_at ==  'normal')?'.selector-buyxgety #buyxgety-product-list':'.q-selector-buyxgety #buyxgety-product-list';
			var dom_parent = (buy_at.indexOf( 'normal') > -1)?'.selector-buyxgety #buyxgety-product-list':'.q-selector-buyxgety #buyxgety-product-list';
			if(self.check_getRecommendeds) {
				var promotion_variant_checked = $(dom_parent).find("input[name='group-product-sale'][type='radio']:checked");
				var apply_variant = $(dom_parent).find("input[name='group-product-sale'][type='radio']:checked").data('applyvariant');
				var notGift = promotion_variant_checked.hasClass('not_gift');
				if( promotion_variant_checked && promotion_variant_checked.length > 0 && notGift == false ) {
					var promotion_countbuy='',promotion_countgift='',promotion_variant_id='';

					promotion_countbuy = parseInt(promotion_variant_checked.attr('data-countbuy'));
					promotion_countgift = parseInt(promotion_variant_checked.attr('data-countgift'));
					promotion_variant_id = promotion_variant_checked.attr('data-id');

					var is_valid_rule = (quantity >= promotion_countbuy) ? true : false;

					//if( is_valid_rule || is_accept ) {
          if( true ) {
						jQuery.ajax({
							type: 'POST',
							url: '/cart/add.js',
							data: params,
							async: false,
							dataType: 'json',
							success: function(cart) {
								cartItem[variant_id] = cart.quantity;
								if(is_valid_rule){
									self.setPromotionStorage_cus(variant_id, promotion_countbuy, promotion_countgift, promotion_variant_id);
									var old_promotion_variant_id = self.getPromotionStorage(variant_id);
								}
								else {
									var old_promotion_variant_id = self.getPromotionStorage(variant_id);
									if(old_promotion_variant_id == undefined){
										self.setPromotionStorage_cus(variant_id, promotion_countbuy, promotion_countgift, promotion_variant_id);
									}
									else{
										if(!old_promotion_variant_id[promotion_variant_id]){
											self.setPromotionStorage_cus(variant_id, promotion_countbuy, promotion_countgift, promotion_variant_id);
										}
										else if(old_promotion_variant_id[promotion_variant_id].hasOwnProperty('priority') && old_promotion_variant_id[promotion_variant_id].priority == false){
											self.setPromotionStorage_cus(variant_id, promotion_countbuy, promotion_countgift, promotion_variant_id);
										}
									}
									old_promotion_variant_id = self.getPromotionStorage(variant_id);
								}
								
								var gOSP = 0;//Gift other but same main product
								if(old_promotion_variant_id != undefined){
									$.each(old_promotion_variant_id,function(vIdGift,infoGift){
										var filterGiftInCart = cartGet.items.filter(x => x.variant_id == vIdGift && x.promotionby.length > 0 && x.promotionby[0].product_id == product_id);
										if(infoGift.priority == false && filterGiftInCart.length > 0){
											gOSP += filterGiftInCart[0].quantity;
										}
									});
								}
								
								
								if(gOSP > 0){
									if((cart.quantity - gOSP) == promotion_countbuy){
										var promoteValid = promotion_countgift;
									}
									else if((cart.quantity - gOSP) > promotion_countbuy){
										var promoteValid = parseInt((cart.quantity - gOSP - promotion_countbuy) / promotion_countbuy)*promotion_countgift;
									}
									else{
										var promoteValid = 0;
									}
								}
								else{
									var promoteValid = parseInt(cart.quantity / promotion_countbuy)*promotion_countgift;
								}

								self.AddCartItemPromotion(promotion_variant_id,promoteValid);
								callback();
							},
							error: function(XMLHttpRequest, textStatus) {
								Haravan.onError(XMLHttpRequest, textStatus);
							}
						});
					} 
					else {
						/*$('#alert_km').modal('show');
						$('.modal-backdrop').css({'height':$(document).height(),'z-index':'99'});*/
						var prodTitle = title || "Vé Standard";
						//var swalName = (buy_at ==  'normal')?'swal-alert-km':'swal-alert-km-qv';
						var swalName = (buy_at.indexOf( 'normal') > -1)?'swal-alert-km':'swal-alert-km-qv';
						var swalText = "Bạn hãy đặt từ 4 \<strong\> " + prodTitle + " \<\/strong\> để được tặng thêm 1 vé Standard nhé!";
						var content = document.createElement("p");
						content.innerHTML = swalText;
						swal({	
							title: "Thông báo khuyến mãi", 
							content: content,  
							//buttons: ["Ở lại trang", "Vẫn thêm vào giỏ hàng"],		
							className: swalName ,	
							closeOnClickOutside: true,		
							buttons: {
								cancel:	"Ở lại trang",
								confirm: {
									text: "Vẫn thêm vào giỏ hàng",
									className: (buy_at.indexOf( 'buynow') > -1)?'btn-swal-checkout':'btn-swal-cart'
								}
							}
						});
					}
				}
				else {
					if(notGift){
						self.setPromotionStorage_cus1(variant_id);
					}
					jQuery.ajax({
						type: 'POST',
						url: '/cart/add.js',
						data: params,
						async: false,
						dataType: 'json',
						success: function(cart) {
							callback();
						},
						error: function(XMLHttpRequest, textStatus) {
							Haravan.onError(XMLHttpRequest, textStatus);
						}
					});
				}
			}
			else {
				jQuery.ajax({
					type: 'POST',
					url: '/cart/add.js',
					data: params,
					async: false,
					dataType: 'json',
					success: function(cart) {
						callback();
					},
					error: function(XMLHttpRequest, textStatus) {
						Haravan.onError(XMLHttpRequest, textStatus);
					}
				});
			}
		},
		addCartBuyXGetY_itemLoop: function(product_id,variant_id,quantity,properties,propertieskho,callback){
			var self = this,
					promotion_variant_id = '',
					promotion_quantity = '',
					checkPromotionRecommend = false;
			if((properties == '' || properties == 'undefined') && (propertieskho == '' || propertieskho == 'undefined')){
				var data_param = {quantity:quantity,id:variant_id};
			}else if(properties != '' && propertieskho != ''){
				var data_param = {quantity:quantity,id:variant_id,properties:{"preorder":properties,"kho":propertieskho}};
			}else if(propertieskho != '' || propertieskho != 'undefined'){
				var data_param = {quantity:quantity,id:variant_id,properties:{"kho":propertieskho}};
			}else{
				var data_param = {quantity:quantity,id:variant_id,properties:{"preorder":properties}};
			}
			var params = {
				type: 'POST',
				async: false,
				url: '/cart/add.js',
				data: data_param,
				dataType: 'json',
				success: function(line_item) { 
					if(product_id != null && product_id != undefined && hrvPromotionInited) {
						buyXgetY.check_getRecommendeds = false;
						HaravanPromotion.GetRecommendeds(parseInt(product_id), function(result) {
							// success
							if ( result.recommendeds.length > 0 ) {
								buyXgetY.check_getRecommendeds = true;
								$.each(result.recommendeds,function(i,v){
									var html = '<h5>Sản phẩm tặng kèm</h5>',html2='';
									html+='<div class="popup-content"><h4><span id="sanphamquatang">'+v.product_name+'</span></h4>';
									html+='<div class="imgqua"><img class="imgnhanqua" src="'+v.product_images[0]+'" alt="'+v.product_name+'"/></div>';
									if(v.is_apply_variant == true){
										checkPromotionRecommend = true;
										html+='<div class="variant_select"><p>Chọn size bạn mong muốn</p><select class="variant_gift">';
										$.each(v.apply_variants,function(i2,v2){
											title_variant = v2.title.replace('/','-');
											html2+='<option value="'+v2.variant_id+'" data-countbuy="'+v2.quantity+'" data-countgift="'+v2.apply_quantity+'" data-percent="'+v2.percent+'">'+title_variant+'</option>';
										});
										html+=html2+'</select></div>';
									}else{
										promotion_variant_id = v.variant_ids[0];
										promotion_quantity = v.quantity;
										html+='<div class="variant_select d-none"><p>Chọn size bạn mong muốn</p><select class="variant_gift">';
										html+='<option value="'+promotion_variant_id+'" data-countbuy="'+promotion_quantity+'" data-countgift="'+v.apply_quantity+'" data-percent="'+v.percent+'">'+v.title+'</option></select></div>';
									}
									html+='<a href="javascript:void(0)" class="btn_nhanqua" data-variantid="">BẤM VÀO ĐÂY ĐỂ NHẬN QUÀ</a>';
									$('#nhanqua').html(html);
								});
								if(checkPromotionRecommend == true){
									$('#nhanquamodal').modal({backdrop: 'static', keyboard: false,show: true});
								}else{
									self.setPromotionStorage(variant_id, quantity, promotion_quantity, promotion_variant_id);
									self.AddCartItemPromotion(promotion_variant_id,promotion_quantity);
								}
							}
						}, function() {
							// error
						}, function() {
							// always
							if(self.check_getRecommendeds && checkPromotionRecommend == true){
								$('.btn_nhanqua').click(function(){
									var promotion_variant_id = $(this).parents('#nhanqua').find('.variant_select .variant_gift').val(),
											promotion_quantity = $(this).parents('#nhanqua').find('.variant_select .variant_gift option:selected').data('countgift');
									self.AddCartItemPromotion(promotion_variant_id,promotion_quantity,function(cart) {
										$('#nhanquamodal').modal('hide');
										callback();
									});
								});
							}else{
								callback();
							}
						});
					}
					else {
						callback();
					}
				},
				error: function(XMLHttpRequest, textStatus) {
					Haravan.onError(XMLHttpRequest, textStatus);
				}
			};
			$.ajax(params);
		},
		AddCartItemPromotion: function(promotion_variant_id, promotion_countgift, callback) {
			jQuery.ajax({
				type: 'POST',
				url: '/cart/add.js',
				async: false,
				data: 'quantity=' + promotion_countgift + '&id=' + promotion_variant_id,
				dataType: 'json',
				success: function(cart) {
					if (Object.prototype.toString.call(callback) === '[object Function]') callback(cart);
					cartItem[promotion_variant_id] = cart.quantity;
				},
				error: function(XMLHttpRequest, textStatus) {
					console.log('Lỗi không đủ điều kiện thêm sản phẩm tặng/giảm');
					if (Object.prototype.toString.call(callback) === '[object Function]') callback();
				}
			});
			/*jQuery.ajax({
				type: 'POST',
				url: '/cart/add.js',
				data: 'quantity=' + quantity + '&id=' + promotion_variant_id,
				dataType: 'json',
				success: function(cart) {
					if (Object.prototype.toString.call(callback) === '[object Function]') callback(cart);
				},
				error: function(XMLHttpRequest, textStatus) {
					console.log('Lỗi không đủ điều kiện thêm sản phẩm tặng/giảm');
					if (Object.prototype.toString.call(callback) === '[object Function]') callback();
				}
			});*/
		},
		UpdateCartFromCart: function() {
			// update lại giỏ hàng tại trang cart
			var self = this;
			var listCart = document.querySelectorAll('[id^="updates_"]');
			var tmp  = "";
			var listVariantIdHasPromotion = [];
			var listPromotionIdExisted = [];
			for(var i = 0; i < listCart.length; i++) {
				var price = $(listCart[i]).attr('data-price');
				var qty = 0;
				var variant_id = Number($(listCart[i]).attr('id').replace('updates_', ''));
				var product_id = Number($(listCart[i]).attr('productid'));
				var orginial_price = Number($(listCart[i]).attr('oriprice'));
				
				if(price == 0){
					if(orginial_price == 0) { 
						qty = 999999;
					}
					else{
						
					}
					listPromotionIdExisted.push(variant_id);
				}
				else{
					qty = parseInt(listCart[i].value);

					var dataPromotion = self.getPromotionStorage(variant_id);
					if(dataPromotion != undefined){
						var currentPromotion = null;
						$.each(dataPromotion,function(iGift,gift){
							if(gift.hasOwnProperty('priority') && gift.priority){
								currentPromotion = gift;
								currentPromotion.variant_id = variant_id;
								currentPromotion.promotion_variant_id = iGift;
								return false;
							}
						});
						listVariantIdHasPromotion.push(currentPromotion);
					}
				}
				if(i > 0) tmp += "&";
				tmp += "updates[]=" + qty;
			}
			tmp += "&note="+$('#note').val();
			
			//console.log(listVariantIdHasPromotion);
			$.post('/cart', tmp).always(function() {
				/*for(var i = 0; i < listVariantIdHasPromotion.length; i++) {
					if(listVariantIdHasPromotion[i].promotion_variant_id
						 && listPromotionIdExisted.indexOf(listVariantIdHasPromotion[i].promotion_variant_id) < 0) {
						self.AddCartItemPromotion(listVariantIdHasPromotion[i].promotion_variant_id,listVariantIdHasPromotion[i].count_gift);
						listPromotionIdExisted.push(listVariantIdHasPromotion[i].promotion_variant_id);
					}
				}*/
				setTimeout(function() { location.reload(); }, 500);
			});
		},
		setPromotionStorage: function(main_variant_id, main_quantity, apply_quantity, promotion_variant_id_raw, is_not_overwrite) {
			var key = 'vnmWWWPromotionStorage';
			var promotionStorage = $.jStorage.get(key);
			if(promotionStorage == undefined || promotionStorage == null)
				promotionStorage = {};
			if(is_not_overwrite) {
				var objExisted = promotionStorage[main_variant_id];
				if(typeof(objExisted) != 'undefined')
					return;
			}
			/*
			promotionStorage[main_variant_id] = promotion_variant_id_raw;
			promotionStorage['count_buy'] = main_quantity;
			promotionStorage['count_gift'] = apply_quantity;
			*/
			promotionStorage[main_variant_id] = {};
			promotionStorage[main_variant_id][promotion_variant_id_raw] = {
				count_buy: main_quantity,
				count_gift: apply_quantity
			};
			$.jStorage.set(key, promotionStorage);
		},
		setPromotionStorage_cus: function(main_variant_id, main_quantity, apply_quantity, promotion_variant_id_raw, is_not_overwrite) {
			var key = 'vnmWWWPromotionStorage';
			var promotionStorage = $.jStorage.get(key);
			if(promotionStorage == undefined || promotionStorage == null) promotionStorage = {};
			if(is_not_overwrite) {
				var objExisted = promotionStorage[main_variant_id];
				if(typeof(objExisted) != 'undefined') return;
			}
			
			if(!promotionStorage[main_variant_id]){
				promotionStorage[main_variant_id] = {};
				promotionStorage[main_variant_id][promotion_variant_id_raw] = {
					count_buy: main_quantity,
					count_gift: apply_quantity,
					priority: true
				};
			}
			else{
				$.each(promotionStorage[main_variant_id],function(indLog,log){
					log.priority = false;
				});

				if(!promotionStorage[main_variant_id][promotion_variant_id_raw]){
					promotionStorage[main_variant_id][promotion_variant_id_raw] = {
						count_buy: main_quantity,
						count_gift: apply_quantity,
						priority: true
					};
				}
				else{
					promotionStorage[main_variant_id][promotion_variant_id_raw].priority = true;
				}
			}
			$.jStorage.set(key, promotionStorage);
		},
		setPromotionStorage_cus1: function(main_variant_id,is_not_overwrite){
			var key = 'vnmWWWPromotionStorage';
			var promotionStorage = $.jStorage.get(key);
			if(promotionStorage == undefined || promotionStorage == null) promotionStorage = {};
			if(is_not_overwrite) {
				var objExisted = promotionStorage[main_variant_id];
				if(typeof(objExisted) != 'undefined') return;
			}
			
			$.each(promotionStorage[main_variant_id],function(indLog,log){
				log.priority = false;
			});
			promotionStorage[main_variant_id]['not_gift'] = {};
			promotionStorage[main_variant_id]['not_gift'].priority = true;
			
			$.jStorage.set(key, promotionStorage);
		},
		getPromotionStorage: function(main_variant_id) {
			var key = 'vnmWWWPromotionStorage';
			var promotionStorage = $.jStorage.get(key);
			if(promotionStorage == undefined || promotionStorage == null)
				promotionStorage = {};
			return promotionStorage[main_variant_id];
		},
		checkPromotionRecommended: function(arr_product_id, callback) {
			if(hrvPromotionInited) {
				HaravanPromotion.CheckRecommendeds(arr_product_id, function(result) {
					// success
					if(typeof(callback) == 'function') callback(result);
				}, function() {
					// error
				}, function() {
					// always
				});
			}
		},
		showGiftLabel: function(){
			var arr_prod_id = [];
			var elementGift = '.product_gift_label';
			$(elementGift).each(function(){
				var id = $(this).attr('data-id');
				arr_prod_id.push(id);
			});
			
			if(arr_prod_id.length > 0){
				this.checkPromotionRecommended(arr_prod_id,function(result){
					$.each(result,function(i,item){
						//	console.log(item.has_gift);
						if (item.has_gift == true || item.has_discount == true){
							$(elementGift + '[data-id="' + item.product_id +'"]').removeClass('d-none');
							$(elementGift).parents('.product-item').find('.product_action .btn_addtocart').removeClass('loading');
						}else{
							$(elementGift).parents('.product-item').find('.product_action .btn_addtocart').removeClass('loading');
						}
					})
				});
			}
		}
	};
	$(document).ready(function (){
		buyXgetY.init();
	});
})(jQuery)
