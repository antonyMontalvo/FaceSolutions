$(document).ready(function() {

    $globalFunction = {

        //Agrega animación de loading al cargar un ajax...
        loadBlock: function(card, loadMessage, msTime, functionToLoad) {

            card.removeClass("d-none");
            card.block({
                message: '<span class="font-weight-semibold"><i class="icon-spinner4 spinner mr-2"></i>&nbsp;' + loadMessage + ' </span>',
                timeout: msTime,
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.8,
                    cursor: 'wait'
                },
                css: {
                    border: 0,
                    padding: '10px 15px',
                    color: '#fff',
                    width: 'auto',
                    '-webkit-border-radius': 3,
                    '-moz-border-radius': 3,
                    backgroundColor: '#333'
                },
                onBlock: functionToLoad
            });


        },

        createFilterSelect: function(select, textoPorDefecto, filtro, valor, nombre) {
            select.empty(); //Reiniciar opciones de select
            var $newOption = $("<option selected='selected'></option>").val("DEFAULT").text("TODOS");
            select.append($newOption).trigger('change');
            $.ajax({
                url: "http://localhost:3000/filter/" + filtro,
                dataType: 'json',
                type: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },
            }).then(function(response) {

                var arreglo = [];

                for (var i = 0; i < response.length; i++) {
                    arreglo[i] = {};
                    arreglo[i].id = response[i][valor];
                    arreglo[i].text = response[i][nombre];
                }


                var propiedad = {
                    placeholder: textoPorDefecto,
                    data: arreglo,
                    language: {
                        noResults: function() {
                            return "No se encontró resultados";
                        }
                    },
                    "width": "100%",
                    "theme": "bootstrap",
                    "dropdownAutoWidth": true,

                }

                select.select2(propiedad);

            });
            select.val('').trigger("change");
        }

    }

});