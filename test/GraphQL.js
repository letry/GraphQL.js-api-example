//During testing, the server must be running
const expect = require('chai').expect;
const rp = require('request-promise-native');
const request = (data, isPost) => rp({
    method: isPost ? 'POST' : 'GET',
    uri: 'http://localhost:3000/graphql', 
    [isPost ? 'body' : 'qs']: { query: `${isPost ? 'mutation ' : ' '}{ ${data} }` },
    json: true
});

describe('GraphQL', () => {
    let testData = {};

    describe('Mutation', () => {
        it('should create test documents in database', async () => {
            ({ data: testData } = await request(`
                product( name: "Italian" ) { name _id }
                category( name: "Pizza" ) { name _id }
            `, true));

            expect(testData.category.name).to.equal('Pizza');
            expect(testData.product.name).to.equal('Italian');
        });

        it('should set parent to category', async () => {
            const result = await request(`
                category(
                    _id: "${testData.category._id}"
                    parent: "${testData.category._id}"
                ) { name _id parent{_id name} }
            `, true);

            expect(result.data.category.parent._id).to.equal(testData.category._id);
        });

        it('should add childProduct in category', async () => {
            const result = await request(`
                productArrayModify(
                    _id: "${testData.product._id}"
                    field: ingredients
                    action: push
                    value: "${testData.product._id}"
                )
            `, true);
            
            expect(result.data.productArrayModify).to.equal(testData.product._id);
        });

        it('should remove childProduct from category', async () => {
            const result = await request(`
                productArrayModify(
                    _id: "${testData.product._id}"
                    field: ingredients
                    action: pull
                    value: "${testData.product._id}"
                )
            `, true);

            expect(result.data.productArrayModify).to.equal(testData.product._id);
        });
    });

    describe('Query', () => {
        context('without arguments', () => {
            it('should return all exist products and categories', async () => {
                const { data } = await request(`
                    product { name _id }
                    category { name _id }
                `);
                
                expect(data).to.include.all.keys(Object.keys(testData));
    
                for (const key in data) 
                    expect(data[key]).to.deep.include(testData[key]);
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
                    expect(data[key][0]).to.include(testData[key]);
                }
            });
        });
    });

    describe('Mutation', () => {
        it('should remove test documents in database', async () => {
            const result = await request(`
                product( _id: "${testData.product._id}" ) { name _id }
                category( _id: "${testData.category._id}" ) { name _id }
            `, true);

            expect(result.data).to.deep.equal(testData);
        });
    })
});
