function getDataFrom(url, callbacks, async = true){
    // Add your code below this line
    req=new XMLHttpRequest();
    req.open("GET",url,async);
    req.send(null);
    if(async){
        req.onload=function(){
            json=JSON.parse(req.responseText);
            callbacks(json)   
        };
    }else{
        return JSON.parse(req.responseText);
    }
}

function where(array, index, value){
    let selected;
    array.forEach((v,i)=>{
        if(v[index] == value.replace(/_/g, ' ')){
            selected = array[i]
        }
    })
    return selected;
}
Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i == 0 ) return this;
    while ( --i ) {
       j = Math.floor( Math.random() * ( i + 1 ) );
       temp = this[i];
       this[i] = this[j];
       this[j] = temp;
    }
    return this;
}