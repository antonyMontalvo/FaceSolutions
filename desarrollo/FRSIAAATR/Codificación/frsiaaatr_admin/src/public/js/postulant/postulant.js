$(document).ready(function() {

    var $local = {
        $tblAlumnos: $("#tblAlumnos"),
        tblAlumnos: "",
        $cmbEscuela: $("#cmbEscuela"),
        $cmbFacultad: $("#cmbFacultad"),
        $cmbEstado: $("#cmbEstado"),
        $btnSearch: $("#btnSearch"),
        $btnReset: $("#btnReset"),
    };

    var initDate = "",
        finishDate = "";

    $local.tblAlumnos = $local.$tblAlumnos.DataTable({
        "ajax": {
            "url": "http://46.101.179.242/postulant/get-postulants",
            "dataSrc": "",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
        },
        "initComplete": function() {
            $local.$tblAlumnos.wrap("<div class='table-responsive'></div>");
            $(window).resize();
        },
        "columnDefs": [{
                "targets": [0, 1, 2, 3, 4, 5],
                "className": "all filtrable text-center",
            },
            /* {
                       "targets": [4],
                       "width": "70%"
                   } */
        ],
        "columns": [{ // 0
                "data": 'codigoPostulante',
                "title": "Código",
                "render": function(data, type, row) {
                    var code = '<span style="font-size: 100%; " class="badge badge-light badge-striped badge-striped-left border-left-primary">' + row.codigoPostulante + '</span>'
                    return code;
                }
            },
            { // 1
                "data": 'nombreCompleto',
                "title": 'Nombre Completo',
                "render": function(data, type, row) {
                    var a = (row.nombreCompleto).toUpperCase();
                    var ref = '<a href="postulant-review/' + row.identificadorPostulante + '">' + a + '</a>';
                    return ref;
                }
            },
            { // 2
                "data": 'dni',
                "title": 'DNI'
            },
            { // 3
                "data": 'sexoPostulante',
                "title": 'Sexo',
                "render": function(data, type, row) {
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

                }
            },
            { // 4
                "data": 'especialidadPostulada',
                "title": "Escuela"
            },
            { // 5 
                "data": 'facultadPostulada',
                "title": "Facultad"
            },
            { // 6
                "data": 'procedenciaPostulante',
                "title": "Procedencia"
            }
        ],

    });

});