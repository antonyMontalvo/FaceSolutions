$(document).ready(function() {

    var $local = {
        $tblNoLeidos: $("#tblNoLeidos"),
        tblNoLeidos: "",
    };

    $local.tblNoLeidos = $local.$tblNoLeidos.DataTable({
        "ajax": {
            "url": " http://localhost:3000/employees/process",
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

});