
var controls = document.evaluate("//table[@class='info tablesorter loanDisplayParent spacebefore spaceafter']/thead/tr[@class='UnselectAll']/td", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var orderButton = document.createElement("span");
orderButton.appendChild(document.createTextNode("Order by margin"));
orderButton.addEventListener("click", onOrderByMargin, false);
controls.snapshotItem(0).appendChild(orderButton);

function onOrderByMargin(event) {
	highlight();
	orderByMargin();
}

//Color green the rows where the margin is less than 1%
function highlight() {
	var headers = document.evaluate("//table[@class='info tablesorter loanDisplayParent spacebefore spaceafter']/thead/tr", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var th_diff = headers.snapshotItem(0).insertCell(4);
	th_diff.outerHTML = '<th title="Difference between the offered capital and the asking price." class="header"><div style="display:block;"><div class="wrapParent" style="max-width: 58px; float: left; padding-right: 2px;"><div class="wrapText" style=" display:inline;">Margin</div></div><span data-titlehelp="Difference between the offered capital and the asking price." style="background-size:15px 15px;  min-height:15px;  padding-left:15px;  float:left;" class="titlehelp2">&nbsp;</span></div></th>';

	var rows = document.evaluate("//table[@class='info tablesorter loanDisplayParent spacebefore spaceafter']/tbody/tr[@class='odd' or @class='even']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i=0; i < rows.snapshotLength; i++) {
		var row = rows.snapshotItem(i);
		var cell = row.insertCell(4);
		var capital = Number(row.cells[3].innerHTML.substring(1).replace(",", ""));
		var asking = Number(row.cells[2].innerHTML.substring(1).replace(",", "")); 
		var diff_value =  asking - capital;
		diff_percentage = (diff_value * 100) / capital;
		cell.innerHTML = diff_percentage.toFixed(2) + "%";
		if (diff_percentage < 1) {
			row.style.backgroundColor = "#95CE9D";
		}
	}
}

//Order the rows by the margin column
function orderByMargin(){
	var swapped = true;
	var count = 0;
	var rows = document.evaluate("//table[@class='info tablesorter loanDisplayParent spacebefore spaceafter']/tbody/tr[@class='odd' or @class='even']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	while (swapped && count < 1000) {
		swapped = false;
		count++;
		for (var i=0; i< rows.snapshotLength-1; i++) {
			var row_1 = rows.snapshotItem(i);
			var capital_1 = Number(row_1.cells[3].innerHTML.substring(1).replace(",", ""));
			var asking_1 = Number(row_1.cells[2].innerHTML.substring(1).replace(",", "")); 
			var diff_value_1 =  asking_1 - capital_1;
			diff_percentage_1 = (diff_value_1 * 100) / capital_1;
			var row_2 = rows.snapshotItem(i+1);
			var capital_2 = Number(row_2.cells[3].innerHTML.substring(1).replace(",", ""));
			var asking_2 = Number(row_2.cells[2].innerHTML.substring(1).replace(",", "")); 
			var diff_value_2 =  asking_2 - capital_2;
			diff_percentage_2 = (diff_value_2 * 100) / capital_2;

			if (diff_percentage_2 < diff_percentage_1) {
				row_1.parentNode.insertBefore(row_2.parentNode.removeChild(row_2), row_1);
				//Take a new snapshot of the list, since the order has changed
				rows = document.evaluate("//table[@class='info tablesorter loanDisplayParent spacebefore spaceafter']/tbody/tr[@class='odd' or @class='even']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				swapped = true;
			}
		}
	}
}

//orderByMargin();