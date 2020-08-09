$(document).ready(function() {

    var $local = {
        $tblRequisitos: $("#tblRequisitos"),
        tblRequisitos: "",
        $tblInfo: $("#tblInfo"),
        tblInfo: "",
    }

    var codigoSolicitud = $("#codigoSolicitud").val();
    console.log(codigoSolicitud);

    $local.tblRequisitos = $local.$tblRequisitos.DataTable({

        "ajax": {
            "url": "../../constancy/all-review-request/" + "00001", //Aquí va el cod solicitud
            "dataSrc": "",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        },
        "initComplete": function() {
            $local.$tblRequisitos.wrap("<div class='table-responsive'></div>");
            $local.$tblRequisitos.attr('style', 'width: 100%;');
            $(window).resize();
        },
        "columnDefs": [{
            "targets": [0, 1, 2, 3, 4, 5],
            "className": "all text-center",
        }],
        "order": [
            [1, "asc"]
        ],
        "columns": [{ //0
                "data": "codigoRequisito",
                "title": "Código",
                "visible": false
            },
            { //1
                "data": "nombreRequisito",
                "title": "Nombre"
            },
            { //2
                "title": "Estado",
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
                "title": 'Verificar Archivo',
                "render": function() {
                    var path = `<button id="observarDoc" class="btn btn-xs btn-success verDocumento" title="" data-tooltip="tooltip" style="padding: 8px 8px;" 
                        data-original-title="Ver Documento"><i class="icon-file-eye"></i></button>`;
                    return path;
                }
            },
            { //4
                "title": 'Evaluar Requisito',
                "render": function() {
                    var a = `<button class="btn btn-xs btn-success aprobar" title="" data-tooltip="tooltip" style="padding: 8px 8px;" 
                        data-original-title="Aprobar"><i class="icon-checkmark4"></i></button>`;
                    var o = `<button class="btn btn-xs btn-danger observar" title="Observar" 
                        data-tooltip="tooltip" style="padding: 8px 8px;"><i class="icon-cross2"></i></button>`
                    return a + " " + o;
                }

            },
            { //5
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
            "url": "../../constancy/postulant-info-request/" + "00001", //Aquí va el cod solicitud
            "dataSrc": function(data) {
                console.log(data);
                var info;
                info = [
                    { "nombreConstancia": data[0].nombreConstancia },
                    { "estadoSolicitud": data[0].estadoSolicitud, "nombreEstadoSolicitud": data[0].nombreEstadoSolicitud },
                    { "nombreCompleto": data[0].nombreCompleto },
                    { "postulanteEmail": data[0].email },
                    { "fechaSolicitud": data[0].fechaSolicitud },
                    { "fechaCambio": data[0].fechaCambio }
                ];
                console.log(info);
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
                if (row.hasOwnProperty('nombreConstancia')) {
                    return '<i class="icon-briefcase mr-2"></i>Trámite:'
                } else if (row.hasOwnProperty('estadoSolicitud')) {
                    return '<i class="icon-file-check mr-2"></i>Estado:'
                } else if (row.hasOwnProperty('nombreCompleto')) {
                    return '<i class="icon-user mr-2"></i>Solicitante:'
                } else if (row.hasOwnProperty('postulanteEmail')) {
                    return '<i class="icon-mail5 mr-2"></i>Correo:'
                } else if (row.hasOwnProperty('fechaSolicitud')) {
                    return '<i class="far fa-calendar-alt mr-2"></i>Fecha Solicitud:'
                } else if (row.hasOwnProperty('fechaCambio')) {
                    return '<i class="far fa-calendar-alt mr-2"></i>Fecha Aprobación:'
                }
            }
        }, {
            "render": function(data, type, row) {
                if (row.hasOwnProperty('nombreConstancia')) {
                    return row.nombreConstancia
                } else if (row.hasOwnProperty('estadoSolicitud')) {
                    var resultado;
                    switch (row.estadoSolicitud) {
                        case 1: //No Leído
                            resultado = '<span class="badge badge-flat border-primary text-primary-600">' + row.nombreEstadoSolicitud + '</span>';
                            break;
                        case 2: //Observado
                            resultado = '<span class="badge badge-flat border-warning text-warning-600">' + row.nombreEstadoSolicitud + '</span>';
                            break;
                        case 3: //En proceso
                            resultado = '<span class="badge badge-flat border-success text-success-600">' + row.nombreEstadoSolicitud + '</span>';
                            break;
                        case 4: //Para firma y envío
                            resultado = '<span class="badge badge-flat border-info text-info-600">' + row.nombreEstadoSolicitud + '</span>';
                            break;
                        case 5: //Tramitado
                            resultado = '<span class="badge badge-flat border-grey-800 text-grey-600">' + row.nombreEstadoSolicitud + '</span>';
                            break;
                        default:
                            resultado = '<span class="badge badge-flat border-grey text-grey-600">' + row.nombreEstadoSolicitud + '</span>';
                    }
                    return resultado;
                } else if (row.hasOwnProperty('nombreCompleto')) {
                    return row.nombreCompleto
                } else if (row.hasOwnProperty('postulanteEmail')) {
                    return row.postulanteEmail
                } else if (row.hasOwnProperty('fechaSolicitud')) {
                    return row.fechaSolicitud
                } else if (row.hasOwnProperty('fechaCambio')) {
                    return row.fechaCambio
                }
            }
        }],
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        fnDrawCallback: function() { $("#tblInfo").find("thead").remove(); }
    });


});