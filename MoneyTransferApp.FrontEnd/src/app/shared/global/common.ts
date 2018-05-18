export class Common {
    static convertResponseToOptions(data) {
        var mapped = data.map(item => {
            return {
                label: item.tagName,
                value: item.tagId
            }
        });

        return mapped;
    }
}