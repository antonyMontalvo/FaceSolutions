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
            "targets": [0, 2, 3, 4, 5],
            "className": "all filtrable text-center",
        }],
        "columns": [{ // 0
                "data": 'code',
                "title": 'Código'
            },
            { // 1
                "data": 'state',
                "title": "Estado",
                "render": function(data, type, row) {
                    var a = ' ';
                    switch (row.state) {
                        case 1:
                            a = '<span class="badge badge-flat border-info text-info-800">POR ATENDER</span>';
                            break;
                        default:
                            a = '<span class="badge badge-flat border-dark text-dark-600">DEFAULT</span>';
                    }
                    return a;
                }
            },
            { // 2 
                "data": 'name',
                "title": "Nombre",
            },
            { // 3
                "data": 'date_created',
                "title": 'Fecha de solicitud',
            },
            { // 4
                "data": 'last_name_1',
                "title": "Apellido Paterno",
            },
            { // 5
                "data": 'last_name_2',
                "title": "Apellido Materno",
            }
        ],

    });

});