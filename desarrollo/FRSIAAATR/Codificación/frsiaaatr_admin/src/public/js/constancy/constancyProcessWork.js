$(document).ready(function () {
  var $local = {
    $solicitante: $("#solicitante"),
    $dni: $("#dni"),
    $facultad: $("#facultad"),
    $especialidad: $("#especialiad"),
  };

  //CLICK EN EL BOTON GRABAR
  $("#btnGrabar").on("click", function () {
    //Obtienes valor de "numero_expediente"
    var id_constancia = document.getElementById("numero_expediente").value;
    var tipo_documento = document.getElementById("cmbTipoDocumento").value;
    var asunto = document.getElementById("asunto").value;

    console.log(id_constancia + "+" + tipo_documento + "+" + asunto);
    document.getElementById("asunto").disabled = true;
    document.getElementById("cmbTipoDocumento").disabled = true;
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Este documento ha sido grabado",
      showConfirmButton: false,
      timer: 1500,
    });
    $.ajax({
      url: "http://localhost:3000/constancy-inp/updatedProcessConstancy",
      data: {
        id_constancia: id_constancia,
        tipo_documento: tipo_documento,
        asunto: asunto,
      },
      type: "PUT",
    }).then(function (response) {});
  });

  $("#anularDoc").on("click", function () {
    var id_constancia = document.getElementById("numero_expediente").value;
    console.log("id_constancia", id_constancia);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Este documento ha sido anulado",
      showConfirmButton: false,
      timer: 1500,
    });
    $.ajax({
      url: "http://localhost:3000/constancy-inp/cancelProcessConstancy",
      data: {
        id_constancia: id_constancia,
      },
      type: "PUT",
    }).then(function (response) {
      console.log("Constancia editada");
    });
  });

  $("#derivarDoc").on("click", function () {
    var id_constancia = document.getElementById("numero_expediente").value;

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Este documento ha sido derivado",
      showConfirmButton: false,
      timer: 1500,
    });
    $.ajax({
      url: "http://localhost:3000/constancy-inp/derivedProcessConstancy",
      data: {
        id_constancia: id_constancia,
      },
      type: "PUT",
    }).then(function (response) {
      console.log("Constancia actualizada");
    });
  });
  //crearSelect($local.$cmbFacultad, "getFaculties", "id", "name");
  //crearSelect($local.$cmbEstado, "getProcessState", "idProcessState", "stateName");

  /*$local.tblEnProceso = $local.$tblEnProceso.DataTable({
        "ajax": {
            "url": "http://localhost:3000/constancy-inp/request-process-list",
            "dataSrc": "",
            "beforeSend": function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
        },
        "initComplete": function() {
            $local.$tblEnProceso.wrap("<div class='table-responsive'></div>");
            $(window).resize();
        },
        "columnDefs": [{
                "targets": [0, 1, 2, 3, 4, 5, 6, 7],
                "className": "all filtrable text-center",
            },
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

    });*/

  function crearSelect(select, filtro, valor, nombre) {
    select.empty(); //Reiniciar opciones de select
    var $newOption = $("<option selected='selected'></option>")
      .val("DEFAULT")
      .text("TODOS");
    select.append($newOption).trigger("change");
    $.ajax({
      url: "http://localhost:3000/filter/" + filtro,
      dataType: "json",
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
      },
    }).then(function (response) {
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
          noResults: function () {
            return "No se encontró resultados";
          },
        },
        width: "100%",
        theme: "bootstrap",
        dropdownAutoWidth: true,
      };

      select.select2(propiedad);
    });
    select.val("").trigger("change");
  }

  /*$local.$cmbFacultad.on('select2:select', function(e) {
        let data = e.params.data;
        cambiarSelect($local.$cmbEscuela, "Seleccione un programa", "especialidades", "getSpecialties", "id", "name", data.id)
    });*/

  function cambiarSelect(
    select,
    textoPorDefecto,
    mantenimiento,
    filtro,
    valor,
    nombre,
    id
  ) {
    select.empty(); //Reiniciar opciones de select
    $.ajax({
      url: "http://localhost:3000/filter/" + filtro + "/" + id,
      dataType: "json",
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
      },
    }).then(function (response) {
      console.log(response);
      select.empty().trigger("change");
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
          noResults: function () {
            return "No se encontró resultados";
          },
        },
        width: "100%",
        theme: "bootstrap",
        dropdownAutoWidth: true,
        dropdownParent: select.parent(),
      };
      if (textoPorDefecto != undefined && textoPorDefecto != null) {
        propiedad.placeholder = textoPorDefecto;
      }
      if (select.hasClass("encabezado")) {
        propiedad.containerCssClass = ":all:";
      }
      select.select2(propiedad);
    });
  }
});
