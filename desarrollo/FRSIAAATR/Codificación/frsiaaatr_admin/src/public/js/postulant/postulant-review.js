$(document).ready(function() {

    var $local = {
        $tblFotos: $("#tblFotos"),
        tblFotos: "",
        $tblInfo: $("#tblInfo"),
        tblInfo: "",
    }

    var split = window.location.href.split('/');
    var codigoSolicitud = split[5];

    $local.tblFotos = $local.$tblFotos.DataTable({

        "ajax": {
            "url": "http://46.101.179.242/postulant/get-all-requirement/" + codigoSolicitud, //Aquí va el cod solicitud
            "dataSrc": "",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        },
        "initComplete": function() {
            $local.$tblFotos.wrap("<div class='table-responsive'></div>");
            $local.$tblFotos.attr('style', 'width: 100%;');
            $(window).resize();
        },
        "columnDefs": [{
            "targets": [0, 1, 2, 3, 4, 5, 6],
            "className": "all text-center",
        }],

        "columns": [{ //0
                "data": 'idRequisito',
                "title": "Identificador",
                "visible": false
            },
            { //1
                "data": 'nombreRequisito',
                "title": "Nombre"
            },
            { //2
                "title": 'Estado',
                "render": function(data, type, row) {
                    var e = '';
                    switch (row.estadoRequisito) {
                        case 1: //Por revisar
                            e = '<span class="badge badge-flat border-primary text-primary-600">' + row.nombreEstadoRequisito + '</span>';
                            break;
                        case 2: //Observado
                            e = '<span class="badge badge-flat border-warning text-warning-600">' + row.nombreEstadoRequisito + '</span>';
                            break;
                        case 3: //Corregido
                            e = '<span class="badge badge-flat border-info text-info-600">' + row.nombreEstadoRequisito + '</span>';
                            break;
                        case 4: //Aprobado
                            e = '<span class="badge badge-flat border-success text-success-600">' + row.nombreEstadoRequisito + '</span>';
                            break;
                        case 5: //Rechazado
                            e = '<span class="badge badge-flat border-danger text-danger-600">' + row.nombreEstadoRequisito + '</span>';
                            break;
                        default:
                            e = '<span class="badge badge-flat border-secondary text-secondary-600">' + row.nombreEstadoRequisito + '</span>';
                    }
                    return e;
                }

            },
            { //3
                "title": 'Verificar Fotos',
                "render": function() {
                    var path = `<button id="observarDoc" class="btn btn-xs btn-success verDocumento" title="" data-tooltip="tooltip" style="padding: 8px 8px;" 
                        data-original-title="Ver Documento"><i class="icon-file-eye"></i></button>`;
                    return path;
                }
            },
            { //4
                "title": 'Evaluar Fotos',
                "render": function(data, type, row) {
                    if (row.estadoRequisito != 4) {
                        var a = `<button class="btn btn-xs btn-success aprobar" title="" data-tooltip="tooltip" style="padding: 8px 8px;" 
                            data-original-title="Aprobar"><i class="icon-checkmark4"></i></button>`;
                        var o = `<button class="btn btn-xs btn-danger observar" title="Observar" 
                            data-tooltip="tooltip" style="padding: 8px 8px;"><i class="icon-cross2"></i></button>`
                        return a + " " + o;
                    } else {
                        return "-";
                    }

                }

            },
            { //5
                "data": 'rutaFoto',
                "title": "Ruta foto",
                "visible": false
            },
            { //6
                "title": 'Observación',
                "render": function(data, type, row) {
                    if (row.observacionRequisito == "") {
                        return '-';
                    } else {
                        return row.observacionRequisito
                    }
                }
            }
        ],
        paging: false,
        info: false,
        searching: false
    });

    $local.tblInfo = $local.$tblInfo.DataTable({
        "ajax": {
            "url": "http://46.101.179.242/postulant/get-one-postulant/" + codigoSolicitud, //Aquí va el cod solicitud
            "dataSrc": function(data) {
                //console.log(data);
                var info;
                info = [
                    { "codigoPostulante": data[0].codigoPostulante },
                    { "nombreCompleto": data[0].nombreCompleto },
                    { "dni": data[0].dni },
                    { "sexoPostulante": data[0].sexoPostulante },
                    { "especialidadPostulada": data[0].especialidadPostulada },
                    { "facultadPostulada": data[0].facultadPostulada },
                    { "procedenciaPostulante": data[0].procedenciaPostulante }
                ];
                $("#idPostulante").val(data[0].idPostulante); //idSolicitud (PK)
                return info;
            },
            "beforeSend": function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        },
        "autoWidth": false,
        "columnDefs": [{
            "targets": 1,
            "className": "text-right",
            "width": '60%'
        }],
        "initComplete": function() {
            $local.$tblInfo.wrap("<div class='table-responsive'></div>");
            $local.$tblInfo.attr('style', 'width: 100%;');
            $(window).resize();
        },
        "columns": [{
            "render": function(data, type, row) {
                if (row.hasOwnProperty('codigoPostulante')) {
                    return '<i class="fas fa-archive mr-2"></i>Código de Postulante:'
                } else if (row.hasOwnProperty('nombreCompleto')) {
                    return '<i class="icon-user mr-2"></i>Nombre del Postulante:'
                } else if (row.hasOwnProperty('dni')) {
                    return '<i class="far fa-address-card mr-2"></i>Dni:'
                } else if (row.hasOwnProperty('sexoPostulante')) {
                    return '<i class="fas fa-transgender mr-2"></i>Sexo Postulante:'
                } else if (row.hasOwnProperty('especialidadPostulada')) {
                    return '<i class="fas fa-user-graduate mr-2"></i>Especialidad:'
                } else if (row.hasOwnProperty('facultadPostulada')) {
                    return '<i class="fas fa-university mr-2"></i>Facultad:'
                } else if (row.hasOwnProperty('procedenciaPostulante')) {
                    return '<i class="fas fa-city mr-2"></i>Procedencia:'
                }

            }
        }, {
            "render": function(data, type, row) {
                if (row.hasOwnProperty('codigoPostulante')) {
                    return row.codigoPostulante
                } else if (row.hasOwnProperty('nombreCompleto')) {
                    return row.nombreCompleto
                } else if (row.hasOwnProperty('dni')) {
                    return row.dni
                } else if (row.hasOwnProperty('sexoPostulante')) {
                    var Resultado;
                    switch (row.sexoPostulante) {
                        case 'F':
                            Resultado = "Femenino";
                            break;
                        case 'M':
                            Resultado = "Masculino";
                            break;
                        default:
                            Resultado = "-";
                            break;
                    }

                    return Resultado;
                } else if (row.hasOwnProperty('especialidadPostulada')) {
                    return row.especialidadPostulada
                } else if (row.hasOwnProperty('facultadPostulada')) {
                    return row.facultadPostulada
                } else if (row.hasOwnProperty('procedenciaPostulante')) {
                    return row.procedenciaPostulante
                }
            }
        }],
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        fnDrawCallback: function() { $("#tblInfo").find("thead").remove(); }
    });

    //Aprobar requisito
    $local.$tblFotos.children("tbody").on("click", ".aprobar", function() {

        var filaSeleccionada = $(this).parents("tr");
        var dataRequisito = $local.tblFotos.row(filaSeleccionada).data();
        var idPostulante = $("#idPostulante").val();

        console.log("Valores" + idPostulante);

        var data = {
            idPostulante: idPostulante,
            idRequisito: dataRequisito.idRequisito,
            estado: 4, //Estado APROBADO
            observacion: 'FOTO APROBADA'
        }

        //console.log(data);

        $.ajax({
            type: "PUT",
            url: "http://46.101.179.242/postulant/update-req-postulant",
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            success: function(response) {
                console.log(response);
                $local.tblFotos.row(filaSeleccionada).remove().draw(false);

                dataRequisito.estadoRequisito = response[0].estadoRequisito;
                dataRequisito.nombreEstadoRequisito = response[0].nombreEstadoRequisito;
                dataRequisito.observacionRequisito = 'FOTO APROBADA';

                var row = $local.tblFotos.row.add(dataRequisito).draw();

            },
            error: function(response) {},
            complete: function(response) {}
        });

    });

    //Observar requisito
    $local.$tblFotos.children("tbody").on("click", ".observar", function() {

        var filaSeleccionada = $(this).parents("tr");
        var dataRequisito = $local.tblFotos.row(filaSeleccionada).data();
        var idPostulante = $("#idPostulante").val();

        $globalFunction.notificationWithInput("Observación", "textarea", "Ingresa una observación...", ["Cancelar", "Observar"], "warning", { 'rows': 8 }, {}, function() {},
            function(result) {
                if (result.value) {

                    var data = {
                        idPostulante: idPostulante,
                        idRequisito: dataRequisito.idRequisito,
                        estado: 2, //Estado APROBADO
                        observacion: result.value
                    }

                    $.ajax({
                        type: "PUT",
                        url: "http://46.101.179.242/postulant/update-req-postulant",
                        data: JSON.stringify(data),
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('Content-Type', 'application/json');
                        },
                        success: function(response) {
                            console.log(response);
                            $local.tblFotos.row(filaSeleccionada).remove().draw(false);

                            dataRequisito.estadoRequisito = response[0].estadoRequisito;
                            dataRequisito.nombreEstadoRequisito = response[0].nombreEstadoRequisito;
                            dataRequisito.observacionRequisito = response[0].observacionRequisito;


                            var row = $local.tblFotos.row.add(dataRequisito).draw();
                            //$(row.node()).animateHighlight();

                            //Actualizando estado en "Detalle"
                            $("#badgeEstado").replaceWith(`<span class="badge badge-flat border-warning 
                                text-warning-600" id="badgeEstado">` + response[0].nombreEstadoRequisito + `</span>`)

                        },
                        error: function(response) {},
                        complete: function(response) {}
                    });

                }
            });

    });

    $local.$tblFotos.children("tbody").on("click", ".verDocumento", function() {

        var filaSeleccionada = $(this).parents("tr");
        var dataRequisito = $local.tblFotos.row(filaSeleccionada).data();
        //console.log(dataRequisito);

        var swalInit = swal.mixin({
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-light'
        });

        if (dataRequisito.rutaFoto == null) {
            swalInit.fire({
                type: 'info',
                html: "El postulante no subió una foto o ha ocurrido un error.",
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonAriaLabel: 'OK',
            });
        } else {
            swalInit.fire({
                title: dataRequisito.nombreRequisito,
                html: `<img src="` + dataRequisito.rutaFoto + `" style='width:400px;'>`,
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonAriaLabel: 'OK',
            });
        }

    });

});