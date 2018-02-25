const expect = require('chai').expect;
const rp = require('request-promise-native');
const request = (data, isPost) => rp({
    method: isPost ? 'POST' : 'GET',
    uri: 'http://localhost:3000/graphql', 
    [isPost ? 'body' : 'qs']: { query: `${isPost ? 'mutation ' : ' '}{ ${data} }` },
    json: true
});


describe('Query', () => {
    let testData = {};
    before(async() => {(
        //Create test database documents
        { data: testData } = await request(`
            product( name: "Italian" ) { name _id }
            category( name: "Pizza" ) { name _id }`
        , true)
    )});

    after(async() => {
        //Remove test database documents
        request(`
            product( _id: "${testData.product._id}" ) { _id }
            category( _id: "${testData.category._id}" ) { _id }
        `, true)
    });

    context('without arguments', () => {
        it('should return all exist products and categories', async () => {
            const { data } = await request(`
                product { name _id }
                category { name _id }
            `);
            
            expect(data).to.include.all.keys(Object.keys(testData));

            for (const key in data) {
                expect(data[key]).to.deep.include({ 
                    _id: testData[key]._id,
                    name: testData[key].name
                });
            }
        });
    });

    context('with arguments', () => {
        it('should return product and category by argument', async () => {
            const { data } = await request(`
                product( _id: "${testData.product._id}" ) { _id name }
                category( _id: "${testData.category._id}" ) { _id name }
            `);

            expect(data).to.include.all.keys(Object.keys(testData));

            for (const key in data) {
                expect(data[key]).to.have.lengthOf(1);
                expect(data[key][0]).to.include({ 
                    _id: testData[key]._id,
                    name: testData[key].name
                });
            }
        });
    });
});