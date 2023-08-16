function createGptTemplate(technologyAns, modernizationAns, kitchenAns, qualityAns) {

    console.log(modernizationAns)
    console.log(modernizationAns === Number(0) ? "tak": "nie")

    const technology =
        `Dla oceny technologii budowy (klucz technologyGPT obiektu JSON):
        - Wpisz 1, jeśli rok budowy jest mniejszy niż 1970, a materiał to cegła.
        - Wpisz 2, jeśli rok budowy jest większy niż 1990, a materiał to bloczki, silka lub cegła.
        - Wpisz 7, jeśli rok budowy jest większy od 1960 i mniejszy od 1992, a w polu <Materiał> wpisano wielka płyta, beton, inny lub mieszany.
        - Wpisz 3, gdy rok budowy jest większy niż 2000, a liczba kondygnacji jest większa niż 13. Podczas analizy weź pod uwagę pola z tekstu jak <Rok budowy>, <Materiał> i <Opis mieszkania>.
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę technologii przypisz do klucza technologyGPT obiektu JSON.`;

    const modernization =
        `Dla oceny modernizacji (klucz modernizationGPT obiektu JSON):
        - Wpisz 4, jeśli rok budynku, bloku lub kamienicy jest mniejszy niż 1995 i w <Opis mieszkania> jest wskazane, że budynek, blok lub kamienica jest ocieplony, odrestaurowany lub odnowiony. Jeżeli to możliwe rok budowy weź z pola <Rok budowy>,
        - Wpisz 4, jeśli rok budowy budynku, bloku lub kamienicy jest mniejszy niż 1995, a w <Opis mieszkania> napisano, że budynek/kamienica/blok posiada nową elewację. Rok budowy weź z pola <Rok budowy>, jeżeli to możliwe.
        - Wpisz 5, jeśli w opisie mieszkania jest napisane, że budynek, blok lub kamienica są w trakcie renowacji lub odnowienia lub gdy renowacja lub odnowienie są planowane.
        - Podczas analizy weź pod uwagę <Rok budowy>, <Materiał> i <Opis mieszkania>.
        - Jeżeli w tekście nie ma informacji wpisz null.
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę modernizacji przypisz do klucza modernizationGPT obiektu JSON.`;

    const kitchen =
        `Dla oceny dotyczącej Kuchni (klucz kitchenGPT obiektu JSON):
        - Wpisz 1, jeżeli w polu <Kuchnia> "ciemna", "prześwit" lub "inny".
        - Wpisz 2, jeżeli w polu <Kuchnia> wpisano "widna".
        - Wpisz 3, jeżeli w polu <Kuchnia> wpisano "aneks kuchenny".
        - Przeanalizuj <Opis mieszkania>. Jeżeli w opisie jest informacja o kuchni ciemnej wpisz 1, jeżeli o kuchni widnej wpisz 2, a jeśli o aneksie kuchennym to wpisz 3
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.`;

    const prompt =
        `Twoim zadaniem jest ocena parametrów oferty nieruchomości z tekstu rozdzielonego przez <>. W tym celu wykonaj następujące czynności:

        1. Stwórz obiekt JSON, który zawiera następujące klucze: technologyGPT, lawStatusGPT, balconyGPT, elevatorGPT, basementGPT, garageGPT gardenGPT, modernizationGPT, alarmGPT, kitchenGPT, outbuildingGPT, qualityGPT, rentGPT, commentsGPT
        
        2. Dla oceny Stanu prawnego (klucz lawStatusGPT obiektu JSON):
        - Jeżeli rok budowy jest mniejszy niż 1990, a materiał do wielka płyta wpisz wartość 2.
        - Pozyskaj informację z pola <Stan prawny>. Jeżeli <Stan prawny> to własność wpisz wartość 1, jeżeli zawarte jest słowo spółdzielcze to wpisz wartość 2.
        - Jeżeli nie ma informacji w polu <Stan prawny> weź pod uwagę <Opis mieszkania>. Jeżeli zostało wspomniane o wspólnocie to wpisz wartość 1. Jeżeli natomiast wspomniano o spółdzielni wpisz wartość 2.
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę stanu prawnego przypisz do klucza lawStatusGPT obiektu JSON.
        
        3. Dla oceny Balkonu (klucz balconyGPT obiektu JSON):
        Dla oceny Balkonu (klucz balconyGPT obiektu JSON):
        - Wpisz wartość 1, jeżeli w <Opis mieszkania> jest balkon lub taras lub loggia.
        - Wpisz wartość 0, jeżeli w <Opis mieszkania>, że w mieszkaniu jest tylko balkon francuski.
        - Jeżeli w <Opis mieszkania> nie ma informacji o balkonie, pobierz informację z pola <Balkon>. Jeżeli jest "tak" wpisz 1. Jeżeli jest "nie" lub jest puste wpisz 0.
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        
        4. Dla oceny Windy (klucz elevatorGPT obiektu JSON):
        - Wpisz 1, jeżeli w polu <Winda> jest tak.
        - Wpisz 0, jeżeli w polu <Winda> jest nie.
        - Jeżeli jednak liczba kondygnacji jest większa od 6 lub informacja ta jest w <Opis mieszkania> to wpisz 1
        - Wpisz 0, jeżeli liczba kondygnacji jest mniejsza od 6 i nie ma takiej informacji w polu <Winda> lub <Opis mieszkania>
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę windy przypisz do klucza elevatorGPT obiektu JSON.
        
        5. Dla oceny Piwnicy (klucz basementGPT obiektu JSON):
        - Wpisz 1, jeżeli w polu <Piwnica> jest tak.
        - Wpisz 0, jeżeli w polu <Piwnica> jest nie.
        - Jeżeli jednak w <Opis mieszkania> jest, że piwnica lub komórka lokatorska jest za dodatkową opłatą to to wpisz 0.
        - Wpisz 1, jeżeli w <Opis mieszkania> jest napisane, że do mieszkania przynależy piwnica lub komórka lokatorska lub jest ona w cenie
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę piwnicy przypisz do klucza basementGPT obiektu JSON.
        
        6. Dla oceny Garażu (klucz garageGPT obiektu JSON):
        - Wpisz 0, jeżeli w polu <Cena miejsca postojowego> lub <Cena miejsca garażowego> jest liczba większa od 0.
        - Wpisz 0, jeżeli w <Opis mieszkania> napisano, że garaż można dokupić.
        - Wpisz 0, jeżeli nie ma informacji o garażu lub miejscu postojowym.
        - Wpisz 1, jeżeli w <Opis mieszkania> jest informacja, że do mieszkania przynależy garaż lub miejsce postojowe.
        - Wpisz 1, jeżeli w <Opis mieszkania> napisano, że garaż lub miejsce postojowe jest w cenie mieszkania.
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        
        7. Ocenę dotyczącą garażu i miejsca postojowego przypisz do klucza garageGPT obiektu JSON.
        - Dla oceny dotyczącej Ogrodu (klucz gardenGPT obiektu JSON):
        - Wpisz 1, jeżeli w polu <Ogród> wpisano tak.
        - Wpisz 0, jeżeli w polu <Ogród> wpisano nie.
        - Wpisz 1, jeżeli w polu <Opis mieszkania> jest informacja, że przy mieszkaniu jest ogród.
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę dotyczącą ogrodu przypisz do klucza gardenGPT obiektu JSON.
        
        8. Dla oceny dotyczącej Monitoringu (klucz alarmGPT obiektu JSON):
        - Wpisz 1, jeżeli w polu <Monitoring> lub <Ochrona> lub <Osiedle strzeżone> wpisano tak.
        - Wpisz 0, jeżeli w polu <Monitoring> lub <Ochrona> lub <Osiedle strzeżone> wpisano nie.
        - Wpisz 1, jeżeli w polu <Opis mieszkania> wpisano o dozorze, monitoringu, ochronie, kamerach
        - Wpisz 0, jeżeli w polu <Opis mieszkania> nie ma nic o dozorze, monitoringu, ochronie, kamerach
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę dotyczącą Monitoringu przypisz do klucza alarmGPT obiektu JSON.
        
        9. Ocenę dotyczącą kuchni przypisz do klucza kitchenGPT obiektu JSON.
        - Dla oceny dotyczącej oficyny (klucz outbuildingGPT obiektu JSON):
        - Wpisz 1, jeżeli w polu <Opis mieszkania> napisano, że mieszkanie jest oficynie kamienicy
        - Wpisz 1, jeżeli w polu <Opis mieszkania> napisano, że mieszkanie jest w drugiej linii zabudowy, a rok budowy jest mniejszy niż 1960.
        - Wpisz 0, jeżeli rok budowy jest większy niż 1960, a mieszkanie nie jest kamienicą
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę dotyczącą Oficyny przypisz do klucza outbuildingGPT obiektu JSON.
        
        10. Dla oceny dotyczącej czynszu (klucz rentGPT):
        - Wpisz wartość czynszu, jeżeli jest w polu <Czynsz>. Jeżeli nie ma to wpisz informację podaną w polu <Opis mieszkania>
        - Jeżeli w polu <Opis mieszkania> jest, że mieszkanie jest bezczynszowe wpisz 0.
        - Jeżeli w tekście nie ma informacji o czynszu wpisz null.
        - Jeżeli nie jesteś pewny odpowiedzi wpisz: -9.
        - Ocenę dotyczącą Czynszu przypisz do klucza rentGPT obiektu JSON.
        
        ${technologyAns ? `11. Do klucza technologyGPT obiektu JSON przypisz wartość ${technologyAns}.` : `11. ${technology}`}
        ${(modernizationAns !== null) ? `12. Do klucza modernizationGPT obiektu JSON przypisz wartość ${modernizationAns}.` : `12. ${modernization}`}   
        ${kitchenAns ? `13. Do klucza kitchenGPT obiektu JSON przypisz wartość ${kitchenAns}.` : `13. ${kitchen}`}
        14. Do klucza qualityGPT obiektu JSON przypisz wartość ${qualityAns ? qualityAns : 'null'}
        
        15. W kluczu commentGPT:
        - Przypisz do kluczy informacje dlaczego nadałeś wartości poszczególnym kluczom.
        - Wykorzystaj taki format: klucz:uzasadnienie
        - Informacje przypisz do klucza commentGPT obiektu JSON.
        
        Wygeneruj tylko poprawny obiekt JSON.`;

        return prompt;
}

module.exports = {
    createGptTemplate,
}