/**
 * Created by jakirsch on 1/1/2016.
 */
var outputElm = document.getElementById('output');
var errorElm = document.getElementById('error');
var dbFileElm = document.getElementById('dbfile')
outputElm.innerHTML ="";
// Start the worker in which sql.js will run
var worker = new Worker("worker.sql.js");
worker.onerror = error;

// Open a database
worker.postMessage({action:'open'});

function error(e) {
    console.log(e);
    errorElm.style.height = '2em';
    errorElm.textContent = e.message;
}

function noerror() {
    errorElm.style.height = '0';
}

// Run a command in the database
function execute(commands) {

    worker.onmessage = function(event) {
        var results = event.data.results;
        for (var i=0; i<results.length; i++) {
            outputElm.innerHTML+=results[i].columns+" "+ results[i].values +"<br />";
        }
        errorElm.innerHTML=" ";
    }
    worker.postMessage({action:'exec', sql:commands});
}

// Load a db from a file
dbFileElm.onchange = function() {
    var f = dbFileElm.files[0];
    var r = new FileReader();
    r.onload = function() {
        worker.onmessage = function () {
            errorElm.innerHTML="Doin' Thangs...";
            outputElm.innerHTML = "2015 Fucking Text Count <br />";
            noerror()
            execute ("select count(*) as 'Sent:'\n from message m inner join handle " +
                "h on h.ROWID=m.handle_id where strftime('%Y'\n,Date(date+strftime('%s'\n,'2001-01-01 00:00:00'\n),'unixepoch'\n))='2015'\n " +
                "and is_from_me=1;")

            execute ("select count(*) as 'Received:'\n from message m inner join handle " +
                "h on h.ROWID=m.handle_id where strftime('%Y'\n,Date(date+strftime('%s'\n,'2001-01-01 00:00:00'\n),'unixepoch'\n))='2015'\n " +
                "and is_from_me=0;")

            execute ("select count(*) as 'Fucks Received:'\n from message m inner join handle " +
                "h on h.ROWID=m.handle_id where strftime('%Y'\n,Date(date+strftime('%s'\n,'2001-01-01 00:00:00'\n),'unixepoch'\n))='2015'\n " +
                "and is_from_me=0 " +
                "and text like '%fuck%'\n;")

            execute ("select count(*) as 'Fucks Given:'\n from message m inner join handle " +
                "h on h.ROWID=m.handle_id where strftime('%Y'\n,Date(date+strftime('%s'\n,'2001-01-01 00:00:00'\n),'unixepoch'\n))='2015'\n " +
                "and is_from_me=1 " +
                "and text like '%fuck%'\n;")

            execute ("select count(*) as 'Love Given:'\n from message m inner join handle " +
                "h on h.ROWID=m.handle_id where strftime('%Y'\n,Date(date+strftime('%s'\n,'2001-01-01 00:00:00'\n),'unixepoch'\n))='2015'\n " +
                "and is_from_me=1 " +
                "and text like '%love you %'\n;")

            execute ("select count(*) as 'Love Received:'\n from message m inner join handle " +
                "h on h.ROWID=m.handle_id where strftime('%Y'\n,Date(date+strftime('%s'\n,'2001-01-01 00:00:00'\n),'unixepoch'\n))='2015'\n " +
                "and is_from_me=0 " +
               "and text like '%love you %'\n;")
        };

        try {
            worker.postMessage({action:'open',buffer:r.result}, [r.result]);
        }
        catch(exception) {
            worker.postMessage({action:'open',buffer:r.result});
        }
    }
    r.readAsArrayBuffer(f);
}
