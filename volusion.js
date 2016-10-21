// ==UserScript==
// @name         Whitepages Pro Web - Volusion
// @namespace    http://pro.whitepages.com/
// @version      1.2
// @description  Implement Deep Links to Whitepages Pro Web Identity Check within Volusion.
// @author       Spencer McLain <smclain@whitepages.com>
// @grant        none
// ==/UserScript==

var currURL = document.url || window.location.href || this.href;
if((currURL.toLowerCase().indexOf('admindetails_processorder.asp') >= 0 ));

{

var wpIP, wpEmail, wpShipCountry, wpShipZip, wpShipState, wpShipCity, wpShipStreet2, wpShipStreet1, wpShipPhone, wpShipName, wpBillCountry, wpBillZip, wpBillState, wpBillCity, wpBillStreet2, wpBillStreet1, wpBillPhone, wpBillName, wpAPIURL;

	//Get Billing Information
	var BillArr = $('#ProcessOrderForm > div.table-orderdetails.summary.mdl-grid > div.table-orderdetails__left.totalandfraudwrapper.mdl-cell.mdl-cell--6-col > div > div:nth-child(5) > table > tbody > tr > td:nth-child(1) > div > p').html().replace(/&nbsp;/g, ' ').replace(/<a href="mailto.*/, '').replace('</a>', '').split('<br>').map( function(elem) { return elem.replace(/\n/g, " ").replace(/\t+/g, " ").replace(/ +/g, " ").trim(); } );
	wpEmail = BillArr.pop();
	wpBillPhone = BillArr.pop();
	wpBillCountry = BillArr.pop().replace('United States', 'US').replace('Canada', 'CA');


	var hasBillCompany = false;
	for(index = 0; index < BillArr.length; index++){
		if(/^[0-9]+/.test(BillArr[index]) && index == 1) {
				break;
		}
		if(/^[0-9]+/.test(BillArr[index]) && index == 2) {
				hasBillCompany = true;
				break;
		}
	}

	if( hasBillCompany ) {
		var wpBillCompany = BillArr.shift();
	}

	wpBillName = BillArr.shift();
	//wpBillAddress = BillArr.join(' ');
	wpBillStreet1 = BillArr.shift();
    var wpBillCityStateZip = BillArr.pop();

	var BillSplit1 = wpBillCityStateZip.split(",");

	wpBillCity = BillSplit1.shift();

	var wpBillStateZip = BillSplit1.pop();

	var BillSplit2 = wpBillStateZip.split(" ");

	BillBlankField = BillSplit2.shift();
	wpBillState = BillSplit2.shift();

	var wpBillZip = BillSplit2.join();


	//wpBillZip = BillSplit2.pop();
	//wpBillState = BillSplit2.pop();
	//wpBillCity = BillSplit1.pop();
	wpBillStreet2 = BillArr.pop();


	//Get Shipping Information
	var ShipArr = $('#ProcessOrderForm > div.table-orderdetails.summary.mdl-grid > div.table-orderdetails__left.totalandfraudwrapper.mdl-cell.mdl-cell--6-col > div > div:nth-child(5) > table > tbody > tr > td:nth-child(2) > div > p').html().replace(/&nbsp;/g, ' ').replace(/<a href="mailto.*/, '').replace('</a>', '').split('<br>').map( function(elem) { return elem.replace(/\n/g, " ").replace(/\t+/g, " ").replace(/ +/g, " ").trim(); } );
	ShipType = ShipArr.pop();
	wpShipPhone = ShipArr.pop();
	wpShipCountry = ShipArr.pop().replace('United States', 'US').replace('Canada', 'CA');

	var hasShipCompany = false;
	for(index = 0; index < ShipArr.length; index++){
		if(/^[0-9]+/.test(ShipArr[index]) && index == 1) {
				break;
		}
		if(/^[0-9]+/.test(ShipArr[index]) && index == 2) {
				hasShipCompany = true;
				break;
		}
	}

	if( hasShipCompany ) {
		var wpShipCompany = ShipArr.shift();
	}

	wpShipName = ShipArr.shift();
	//wpShipAddress = ShipArr.join(' ');
	wpShipStreet1 = ShipArr.shift();
    var wpShipCityStateZip = ShipArr.pop();

	var ShipSplit1 = wpShipCityStateZip.split(",");

	wpShipCity = ShipSplit1.shift();

	var wpShipStateZip = ShipSplit1.pop();

	var ShipSplit2 = wpShipStateZip.split(" ");

	ShipBlankField = ShipSplit2.shift(); //There is probably a better way to do this. The array has a blank field at the top... and because we want to join a zip that has a space in it.
	wpShipState = ShipSplit2.shift();

	var wpShipZip = ShipSplit2.join();


	//wpBillZip = BillSplit2.pop();
	//wpBillState = BillSplit2.pop();
	//wpBillCity = BillSplit1.pop();
	wpShipStreet2 = ShipArr.pop();


	//Get IP Address
	var wpIP = $('#ProcessOrderForm > div.table-orderdetails.summary.mdl-grid > div.table-orderdetails__left.totalandfraudwrapper.mdl-cell.mdl-cell--6-col > div > table > tbody > tr > td > div > p:nth-child(2) > a').html().trim();

	//now we have all the input data, so we can build the Pro Web Identity Check URLs
	wpAPIURL = 'https://pro.lookup.whitepages.com/identity_checks?';
	wpAPIURL += 'billing_name='+encodeURIComponent(wpBillName)+'&';
	wpAPIURL += 'billing_phone='+encodeURIComponent(wpBillPhone)+'&';
	wpAPIURL += 'billing_address_street_line_1='+encodeURIComponent(wpBillStreet1)+'&';

	if(wpBillStreet2)
  		wpAPIURL += "billing_address_street_line_2="+encodeURIComponent(wpBillStreet2)+'&';

	wpAPIURL += 'billing_address_city='+encodeURIComponent(wpBillCity)+'&';
	wpAPIURL += 'billing_address_state_code='+encodeURIComponent(wpBillState)+'&';
	wpAPIURL += 'billing_address_postal_code='+encodeURIComponent(wpBillZip)+'&';
	wpAPIURL += 'billing_address_country_code='+encodeURIComponent(wpBillCountry)+'&';

	wpAPIURL += 'shipping_name='+encodeURIComponent(wpShipName)+'&';
	wpAPIURL += 'shipping_phone='+encodeURIComponent(wpShipPhone)+'&';
	wpAPIURL += 'shipping_address_street_line_1='+encodeURIComponent(wpShipStreet1)+'&';


	if(wpShipStreet2)
  		wpAPIURL += 'shipping_address_street_line_2='+encodeURIComponent(wpShipStreet2)+'&';

	wpAPIURL += 'shipping_address_city='+encodeURIComponent(wpShipCity)+'&';
	wpAPIURL += 'shipping_address_state_code='+encodeURIComponent(wpShipState)+'&';
	wpAPIURL += 'shipping_address_postal_code='+encodeURIComponent(wpShipZip)+'&';
	wpAPIURL += 'shipping_address_country_code='+encodeURIComponent(wpShipCountry)+'&';

	wpAPIURL += 'email_address='+encodeURIComponent(wpEmail)+'&';
	wpAPIURL += 'ip_address='+encodeURIComponent(wpIP);

	//now insert links for these into billing and shipping sections
	$('#ProcessOrderForm > div.table-orderdetails.summary.mdl-grid > div.table-orderdetails__left.totalandfraudwrapper.mdl-cell.mdl-cell--6-col > div > table > tbody > tr > td > table').after('<div id="wplink"><a href="' + wpAPIURL +'" target="_blank">Verify with Whitepages Pro</a></div>');
	$('#wplink').css('text-align', 'right').css('font-size', '20px');

}
