export class IndexedDbHelper {
  static saveDB(newData: any[], notificationService: any) {
    const dbName = "MyDatabase";
    const storeName = "indicadoresCE";

    // Verificar si el navegador soporta IndexedDB
    if (!window.indexedDB) {
      notificationService.notif("error", 'Su navegador no soporta una versión estable de IndexedDB. Tal y como las características no serán válidas');
      return;
    }


    // Función para borrar la base de datos
    const deleteDatabase = () => {
      var deleteRequest = indexedDB.deleteDatabase(dbName);

      deleteRequest.onsuccess = function (event: any) {
        console.log("Base de datos borrada con éxito");
        openDatabase();
      };

      deleteRequest.onerror = function (event: any) {
        console.error("Error al borrar la base de datos", event);
        openDatabase();
      };
    };

    const openDatabase = () => {
      const params = indexedDB.open(dbName, 1); // Abrir la base de datos

      params.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        // Crea un almacén de objetos (objectStore) para esta base de datos si no existe
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      };

      params.onsuccess = (event: any) => {
        const db = event.target.result;
        // Iniciar una transacción de lectura y escritura
        const transaction = db.transaction(storeName, "readwrite");
        const objectStore = transaction.objectStore(storeName);
        // Iterar sobre los datos nuevos y actualizar o añadir registros
        newData.forEach((data: any) => {
          const putRequest = objectStore.put(data);
          putRequest.onerror = (e: any) => {
            console.error(`Error al actualizar el registro con ID ${data.id}:`, e.target.error);
          };
        });

        transaction.oncomplete = () => {
          console.log('Todos los registros han sido actualizados');
        };
        transaction.onerror = (e: any) => {
          console.error('Error en la transacción:', e.target.error);
        };
      };

      params.onerror = (event: any) => {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
      };
    }

    deleteDatabase();

  }
}
