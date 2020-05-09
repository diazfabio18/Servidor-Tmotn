n =  new Date();
//Año
y = n.getFullYear();
//Mes
m = n.getMonth() + 1;
//Día
d = n.getDate();

var dateControl = document.querySelector('input[type="date"]');
dateControl.value = y+'-'+m+'-'+d;