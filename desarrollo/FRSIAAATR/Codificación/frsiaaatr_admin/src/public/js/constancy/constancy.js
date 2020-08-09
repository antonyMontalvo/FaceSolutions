$(document).ready(function() {

    var $local = {
        $tblNoLeidos: $("#tblNoLeidos"),
        tblNoLeidos: "",
        $cmbEscuela: $("#cmbEscuela"),
        $cmbFacultad: $("#cmbFacultad"),
        $cmbEstado: $("#cmbEstado"),
        $btnSearch: $("#btnSearch"),
        $btnReset: $("#btnReset"),
    };

    crearSelect($local.$cmbFacultad, "getFaculties", "id", "name");
    crearSelect($local.$cmbEstado, "getProcessState", "idProcessState", "stateName");

    $local.tblNoLeidos = $local.$tblNoLeidos.DataTable({
        "ajax": {
            "url": "http://localhost:3000/employees/process",
            "dataSrc": "",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
        },
        "initComplete": function() {
            $local.$tblNoLeidos.wrap("<div class='table-responsive'></div>");
            $(window).resize();
        },
        "columnDefs": [{
                "targets": [0, 1, 2, 3, 4, 5, 6, 7],
                "className": "all filtrable text-center",
            },
            /* {
                       "targets": [4],
                       "width": "70%"
                   } */
        ],
        "columns": [{ // 0
                "data": 'estadoSolicitud',
                "title": "Estado",
                "render": function(data, type, row) {
                    var a = ' ';
                    switch (row.estadoSolicitud) {
                        case 1:
                            a = '<span class="badge badge-flat border-info text-info-800">' + row.nombreEstadoSolicitud + '</span>';
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
                "data": 'nombreConstancia',
                "title": 'Tipo Constancia',
                "render": function(data, type, row) {
                    var type = '<span style="font-size: 100%; " class="badge badge-light badge-striped badge-striped-left border-left-success">' + row.nombreConstancia + '</span>'
                    return type;
                }
            },
            { // 3
                "data": 'fechaSolicitud',
                "title": 'Fecha Solicitud'
            },
            { // 4
                "title": "Asunto",
                "render": function(data, type, row) {
                    var a = row.nombreConstancia + " - " + row.facultadIniciales + " - Cod postulante: " +
                        row.codigoPostulante + " - DNI: " + row.numeroDocumento;
                    return a.toUpperCase();
                }
            },
            { // 5 
                "data": 'numeroDocumento',
                "title": "N° Doc. Identidad"
            },
            { // 6
                "data": 'nombreCompleto',
                "title": "Nombre Completo",
            },
            { // 7
                "data": 'facultad',
                "title": "Facultad postulada",
            },
            { // 8
                "data": 'escuelaAcademica',
                "title": "Especialidad postulada",
            }
        ],

    });

    function crearSelect(select, filtro, valor, nombre) {
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
                placeholder: "Selecciona una escuela",
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

    };

    $local.$cmbFacultad.on('select2:select', function(e) {
        let data = e.params.data;
        cambiarSelect($local.$cmbEscuela, "Seleccione un programa", "especialidades", "getSpecialties", "id", "name", data.id)
    });

    function cambiarSelect(select, textoPorDefecto, mantenimiento, filtro, valor, nombre, id) {
        select.empty(); //Reiniciar opciones de select
        $.ajax({
            url: "http://localhost:3000/filter/" + filtro + "/" + id,
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
        }).then(function(response) {
            console.log(response);
            select.empty().trigger('change');
            var arreglo = [];

            if (mantenimiento == "especialidades") {
                for (var i = 0; i < response.length; i++) {
                    arreglo[i] = {};
                    arreglo[i].id = response[i][valor];
                    arreglo[i].text = response[i][nombre];
                }
            }

            console.log(arreglo);
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
                "dropdownParent": select.parent(),
            }
            if (textoPorDefecto != undefined && textoPorDefecto != null) {
                propiedad.placeholder = textoPorDefecto;
            }
            if (select.hasClass("encabezado")) {
                propiedad.containerCssClass = ":all:";
            }
            select.select2(propiedad);

        });
    }

    $("#btnReset").on("click", function() {
        resetFiltros();
    })

    $("#btnSearch").on("click", function() {
        filtrarRegistros();
    })

    function resetFiltros() {
        $("#nombres").val('');
        $("#apellidoPaterno").val('');
        $("#apellidoMaterno").val('');
        $("#numeroDocumento").val('');
        $("#rangoFechas").val('');
        crearSelect($local.$cmbEscuela, "getSpecialties", "id", "name");
        crearSelect($local.$cmbFacultad, "getFaculties", "id", "name");
        crearSelect($local.$cmbEstado, "getProcessState", "idProcessState", "stateName");
    }

    function filtrarRegistros() {
        name = $('#nombres').val();
        lastnamePatern = $('#apellidoPaterno').val();
        lastnameMatern = $('#apellidoMaterno').val();
        dni = $('#numeroDocumento').val();
        number_doc = $("#codigoSolicitud").val();
        date = $("#rangoFechas").val();
        cmbFacultad = $("#cmbFacultad").val();
        cmbEscuela = $("#cmbEscuela").val();

        if (cmbFacultad == "DEFAULT") cmbFacultad = null;
        if (cmbEscuela == "DEFAULT") cmbEscuela = null;

        if (lastnamePatern == "") { lastnamePatern = null; }
        if (lastnameMatern == "") { lastnameMatern = null; }
        if (dni == "") { dni = null; }
        if (number_doc == "") { number_doc = null; }
        if (date == "") { date = null; }
        if (name == "") { name = null; }
        var data = {
            "name": name,
            "lastnamePatern": lastnamePatern,
            "lastnameMatern": lastnameMatern,
            "dni": dni,
            "number_doc": number_doc,
            "date": date,
            "id_faculty": cmbFacultad,
            "id_specialty": cmbEscuela
        };

        //console.log("DATA: ", data);
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/constancy/filterProcess",
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            success: function(response) {
                //console.log("Registros filtrados");
                $local.tblNoLeidos.clear();
                $.each(response, function(index, value) {
                    $local.tblNoLeidos.row.add(value);
                });

                $local.tblNoLeidos.draw();
            }
        });
    }
});