$(document).ready(function() {

    var $local = {
        $tblHistorial: $("#tblHistorial"),
        tblHistorial: ""
    }

    //Select2 Bootstrap theme
    $.fn.select2.defaults.set("theme", "bootstrap");

    //Select de Facultades
    $globalFunction.createFilterSelect($("#codigoFacultad"), "Selecciona una facultad", "getFaculties", "id", "name");

    //Llenando tabla de finalizados y rechazados
    $local.tblHistorial = $local.$tblHistorial.DataTable({
        "ajax": {
            "url": "../../record/requests-all",
            "dataSrc": "",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
        },
        "initComplete": function() {
            $local.$tblHistorial.wrap("<div class='table-responsive'></div>");
            $(window).resize();
        },
        "columnDefs": [{
            "targets": [0, 1, 2, 3],
            "className": "all filtrable text-center",
        }, ],
        "columns": [{ // 0
                "data": 'estadoSolicitud',
                "title": "Estado",
                "render": function(data, type, row) {
                    var a = ' ';
                    switch (row.estadoSolicitud) {
                        case 1:
                            a = '<span class="badge badge-flat border-info text-info-800">' + row.nombreEstadoSolicitud + '</span>';
                            break;
                        case 2:
                            a = '<span class="badge badge-flat border-warning text-warning-800">' + row.nombreEstadoSolicitud + '</span>';
                            break;
                        default:
                            a = '<span class="badge badge-flat border-dark text-dark-600">' + row.nombreEstadoSolicitud + '</span>';
                    }
                    return a;
                }
            },
            { // 1
                "data": 'codigoSolicitud',
                "title": 'Código',
                "render": function(data, type, row) {
                    var code = '<span style="font-size: 100%; " class="badge badge-light badge-striped badge-striped-left border-left-primary">' + row.codigoSolicitud + '</span>'
                    return code;
                }
            },
            { // 2
                "data": 'fechaSolicitud',
                "title": 'Fecha Solicitud'
            },
            { // 3
                "title": "Asunto",
                "render": function(data, type, row) {
                    var a = (row.nombreConstancia + " - " + row.facultadIniciales + " - Cod postulante: " +
                        row.codigoPostulante + " - DNI: " + row.numeroDocumento).toUpperCase();
                    var ref = '<a href="review-request/' + row.codigoSolicitud + '">' + a + '</a>';
                    return ref;
                }
            }
        ],

    });

    //Filtro checkbox
    var estados = [];
    var constancias = [];
    /* 
        var especialidades = []; */

    //BUSQUEDA FILTRO
    $(':checkbox').change(function() {
        if ($(this).is(":checked")) {
            estados = []; //Limpiando el arreglo cada vez que das check, si no se repiten valores
            $("#checkbox-container :checked").each(function() {
                estados.push($(this).val());
            });

            constancias = [];
            $("#checkbox-container-constancias :checked").each(function() {
                constancias.push($(this).val());
            });

            /* especialidades = [];
            $("#checkbox-container-especialidades :checked").each(function() {
                console.log($(this).val);
                especialidades.push($(this).val());
            }); */

        } else {
            //Extrae el name del checkbox que ha cambiado a 'unchecked' / se ha desmarcado.
            var name = $(this).attr('name');
            console.log(name);
            var x = "";

            switch (name) { //En base a este name, sabemos de que array vamos a quitar el valor que se ha desmarcado
                case 'estados':
                    x = estados.indexOf($(this).val());
                    estados.splice(x, 1);
                    break;
                case 'constancias':
                    x = constancias.indexOf($(this).val());
                    constancias.splice(x, 1);
                    break;
                    /* 
                                    case 'especialidades':
                                        x = especialidades.indexOf($(this).val());
                                        especialidades.splice(x, 1);
                                        break; */
            }
        }
        //console.log(estados);
        var data = {
            "idFacultad": 1,
            "arrayEstados": estados,
            "arrayConstancias": constancias,
            "arrayEspecialidades": ""
        }
        console.log(data);

        //Cada vez que se marca o desmarca un checkbox, se ejecuta este ajax según los arrays...
        $.ajax({
            type: "POST",
            url: "../../record/requests-filter",
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        }).done(function(response) {
            console.log(response);

            $local.tblHistorial.clear().draw();
            $globalFunction.loadBlock($("#cardFinalizadas"), 'Actualizando información...', 900,
                function() {
                    $(this).parent().addClass("loading");
                    $local.tblHistorial.rows.add(response).draw();
                }
            )

        }).fail(function(xhr) {
            console.log("Error");
        });

    });


    var bloqueCheckbox = $('.checkTemplate');

    $("#codigoFacultad").on('select2:select', function(e) {
        var data = e.params.data;
        console.log(data);

        $.ajax({
            type: "GET",
            url: "../../filter/getSpecialties",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            success: function(response) {
                $("#checkbox-container-especialidades").empty();
                response.forEach(function(r, index, array) {

                    var bloqueCheckboxCopia = bloqueCheckbox.clone();
                    bloqueCheckboxCopia.find('.valorCheckbox').attr('value', r.id);
                    bloqueCheckboxCopia.find('.valorCheckbox').attr('id', "checkbox_" + (index + 1));
                    bloqueCheckboxCopia.find('.labelCheckbox').empty().append(r.name);
                    bloqueCheckboxCopia.find('.labelCheckbox').attr('for', "checkbox_" + (index + 1))

                    $("#checkbox-container-especialidades").append(bloqueCheckboxCopia);


                    /* var checkbox = `<div class="form-check">
                    <input class="form-check-input" type="checkbox" value="` + r.id + `" id="checkbox_` + r.id + `"
                        name="especialidades">
                    <label class="form-check-label" for="checkbox_` + r.id + `">
                        ` + r.name + `
                    </label>
                    </div>`; */

                    //$("#checkbox-container-especialidades").append(checkbox);
                });
            }
        });

        $("#cardEspecialidades").removeClass("d-none");

    });

});