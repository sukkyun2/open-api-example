const apiUrl = 'http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd';
const serviceKey = 'NDiq6zYeOQ65ExipfrCFE%2FLCZig6vDBqcCkwkXWGgFSL%2BZokU2nGJgzHH2lVscm%2BWuXevNugFWflPDUB5B0gjg%3D%3D';


const searchAddress = () => {
    const req = createReq();
    const errors = validate(req);

    if(errors.length){
        alert(errors.pop());
        return;
    }

    sendRequest(req);
}

const createReq = () => {
    const selectOption = document.getElementById('searchType');
    return {
        searchWord : document.getElementById('searchWord').value,
        searchType : selectOption.options[selectOption.selectedIndex].value,
    }
}

const validate = (req) => {
    const errors = [];

    if(!req){
        errors.push('req is not null');
    }

    if(!req.searchWord){
        errors.push('검색어를 입력해주세요');
    }

    if(req.searchWord.length < 2){
        errors.push('키워드를 2글자 이상으로 입력해주세요.');
    }

    if(!req.searchType){
        errors.push('검색구분을 선택해주세요.');
    }

    return errors;
}
const sendRequest = (req) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET',`${apiUrl}?ServiceKey=${serviceKey}&srchwrd=${req.searchWord}&seachSe=${req.searchType}&countPerPage=10&Page=1`);
    xhr.send();

    xhr.onload = () => {
        const responseXML = xhr.responseXML;

        if(xhr.status !== 200){
            alert('네트워크 에러입니다. 잠시후 다시 시도해주세요.');
            return;
        }

        if(responseXML.getElementsByTagName('returnCode').item(0).firstChild.nodeValue === '01'){ //사용자 정의 에러
            alert(responseXML.getElementsByTagName('errMsg').item(0).firstChild.nodeValue);
            return;
        }

        const areas = parseXml(responseXML);

        draw(areas);
    }
}

const parseXml = (responseXML) => {
    const areaListResponse = responseXML.getElementsByTagName('newAddressListAreaCd');

    return Array.from(areaListResponse).map(area=>({
                zipNo : area.getElementsByTagName('zipNo').item(0).firstChild.nodeValue,
                lnmAdres : area.getElementsByTagName('lnmAdres').item(0).firstChild.nodeValue,
                rnAdres : area.getElementsByTagName('rnAdres').item(0).firstChild.nodeValue
    }))
}

const draw = function(areas) {
    const areaHTML = areas.length ? areas.map(area=>`
        <tr>
            <td>${area.zipNo}</td>
            <td>${area.lnmAdres}</td>
            <td>${area.rnAdres}</td>
        </tr>
        `).join('') 
        : '<tr colspan="3">검색결과가 없습니다</tr>';

    const table = document.getElementById('address-table-body');
    table.innerHTML = areaHTML;
}
