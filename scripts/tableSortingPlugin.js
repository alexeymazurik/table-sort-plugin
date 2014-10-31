(function($){

    $.fn.sorting = function() {

        function dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        function dynamicSortMultiple(multiplySort) {
            /*
             * save the arguments object as it will be overwritten
             * note that arguments object is an array-like object
             * consisting of the names of the properties to sort by
             */
            var props = multiplySort;
            return function (obj1, obj2) {
                var i = 0, result = 0, numberOfProperties = props.length;
                /* try getting a different result from 0 (equal)
                 * as long as we have extra properties to compare
                 */
                while(result === 0 && i < numberOfProperties) {
                    result = dynamicSort(props[i])(obj1, obj2);
                    i++;
                }
                return result;
            }
        }


        var thead = [],
            tbody = [],
            $self = $(this),
            multiplySort = [];



        $self.find('thead tr td').each(function(){
            thead.push($(this).text());
            $(this).css({
                "cursor": "pointer"
            })
        });



        $self.find('tbody tr').each(function(){
            var tmp = {};
            $(this).find('td').each(function(i){
                tmp[thead[i]] = $(this).text();
            });
            tbody.push(tmp);

        });

        $self.find('thead tr td').each(function(){
                $(this).on('click', function(){
                    console.log($.inArray("First name", thead));
                    var tmp = $(this).text();
                    if (multiplySort.indexOf(tmp) == -1) {
                        multiplySort.push(tmp);
                        $(this).css("background", "lightgreen");
                    }
                    else {
                        multiplySort.splice(multiplySort.indexOf(tmp),1);
                        $(this).css("background", "none");
                    }
                    console.log(multiplySort);
                    sort();
                });
        });

        function sort() {
            var smth = tbody.sort(dynamicSortMultiple(multiplySort)),
                tbodyCells = [];

            $self.find('tbody tr').each(function(){
                var tmp = [];
                $(this).find('td').each(function(){
                    tmp.push($(this));
                });
                tbodyCells.push(tmp);
            });

            for (var i = 0; i < tbodyCells.length; i++) {
                for (var j = 0; j < tbodyCells[i].length; j++) {
                    tbodyCells[i][j].text(smth[i][thead[j]]);
                }
            }
        }

    }
}($));