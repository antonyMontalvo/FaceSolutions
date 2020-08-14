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

    var initDate = "",
        finishDate = "";

    $localFunction = {
        changeSelect: function(select, defaultText, endpoint, value, name, id) {
            select.empty(); //Reiniciar opciones de select
            $.ajax({
                url: "http://localhost:3000/filter/" + endpoint + "/" + id,
                dataType: 'json',
                type: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },
            }).then(function(response) {
                select.empty().trigger('change');
                var array = [];

                if (endpoint == "getSpecialties") {
                    for (var i = 0; i < response.length; i++) {
                        array[i] = {};
                        array[i].id = response[i][value]; //valor 
                        array[i].text = response[i][name]; //nombre
                    }
                }

                var property = {
                    placeholder: defaultText,
                    data: array,
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
                if (defaultText != undefined && defaultText != null) {
                    property.placeholder = defaultText;
                }
                if (select.hasClass("encabezado")) {
                    property.containerCssClass = ":all:";
                }
                select.select2(property);

            });
        }
    }

    $("#rangoFechas").daterangepicker();
    $globalFunction.createFilterSelect($local.$cmbFacultad, "Selecciona una facultad", "getFaculties", "id", "name");
    $globalFunction.createFilterSelect($local.$cmbEstado, "Selecciona un estado", "getProcessState", "idProcessState", "stateName");

    $local.tblNoLeidos = $local.$tblNoLeidos.DataTable({
        "ajax": {
            "url": "http://localhost:3000/constancy/all-process",
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
                    var a = (row.nombreConstancia + " - " + row.facultadIniciales + " - Cod postulante: " +
                        row.codigoPostulante + " - DNI: " + row.numeroDocumento).toUpperCase();
                    var ref = '<a href="review-request/' + row.codigoSolicitud + '">' + a + '</a>';
                    return ref;
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

    $local.$cmbFacultad.on('select2:select', function(e) {
        let data = e.params.data;
        $localFunction.changeSelect($local.$cmbEscuela, "Seleccione un programa", "getSpecialties", "id", "name", data.id)
    });

    //Limpia los campos del filtro
    $("#btnReset").on("click", function() {
        resetFilter();
    });

    //Ejecuta la busqueda según los datos en el filtro
    $("#btnSearch").on("click", function() {
        $globalFunction.loadBlock($("#tblNlBlock"), "Actualizando información...", 1200, filterRecords());
    });

    //Rango de fechas
    $('.daterange-basic').on('apply.daterangepicker', function(ev, picker) {
        initDate = picker.startDate.format('YYYY-MM-DD');
        finishDate = picker.endDate.format('YYYY-MM-DD');
    });

    function resetFilter() {
        $("#nombres").val('');
        $("#apellidoPaterno").val('');
        $("#apellidoMaterno").val('');
        $("#numeroDocumento").val('');
        $("#rangoFechas").val('');
        $("#codigoSolicitud").val('');
        $globalFunction.createFilterSelect($local.$cmbEscuela, "Selecciona una escuela", "getSpecialties", "id", "name");
        $globalFunction.createFilterSelect($local.$cmbFacultad, "Selecciona una facultad", "getFaculties", "id", "name");
        $globalFunction.createFilterSelect($local.$cmbEstado, "Selecciona un estado", "getProcessState", "idProcessState", "stateName");
    }

    function filterRecords() {
        name = $('#nombres').val();
        lastNamePatern = $('#apellidoPaterno').val();
        lastNameMatern = $('#apellidoMaterno').val();
        dni = $('#numeroDocumento').val();
        number_doc = $("#codigoSolicitud").val();
        date = $("#rangoFechas").val();
        cmbFacultad = $("#cmbFacultad").val();
        cmbEscuela = $("#cmbEscuela").val();
        cmbEstadoSolicitud = $("#cmbEstado").val();
        fechaInicio = initDate;
        fechaFin = finishDate;

        if (cmbFacultad == "DEFAULT") cmbFacultad = null;
        if (cmbEscuela == "DEFAULT") cmbEscuela = null;
        if (cmbEstadoSolicitud == "DEFAULT") cmbEstadoSolicitud = null;

        if (lastNamePatern == "") { lastNamePatern = null; }
        if (lastNameMatern == "") { lastNameMatern = null; }
        if (dni == "") { dni = null; }
        if (number_doc == "") { number_doc = null; }
        if (date == "") { date = null; }
        if (name == "") { name = null; }
        if (fechaInicio == "" && fechaFin == "") {
            fechaInicio = null;
            fechaFin = null;
        }

        var data = {
            "name": name,
            "lastNamePatern": lastNamePatern,
            "lastNameMatern": lastNameMatern,
            "dni": dni,
            "numberDoc": number_doc,
            "date": date,
            "idFaculty": cmbFacultad,
            "idSpecialty": cmbEscuela,
            "idProcessState": cmbEstadoSolicitud,
            "startDate": fechaInicio,
            "endDate": fechaFin
        };

        //Repitando tabla
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/constancy/filter-process",
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            success: function(response) {
                //Limpia tabla
                $local.tblNoLeidos.clear();

                //Los resultados encontrados se pintan en la tabla
                $.each(response, function(index, value) {
                    $local.tblNoLeidos.row.add(value);
                });

                $local.tblNoLeidos.draw();
            }
        });
    }
});