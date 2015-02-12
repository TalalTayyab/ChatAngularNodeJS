var chai = require("chai");

var Users = require("../socket/users.js");


describe("Test Users class", function () {
    
    beforeEach(function () {
        Users.add({ name: 'user 1' });
    });
    
    afterEach(function () {
        Users.removeAll();
    });
    
    it("should add user", function () {
        
        
        var users = Users.select();
        
        chai.assert.isArray(users, "Users.select should return an array");
        chai.expect(users.length).to.be.equal(1);
        chai.expect(users[0].name).to.be.equal('user 1');
    });
    
    it("should remove user 1 have zero elements", function () {
        
        Users.remove('user 1');
        var users = Users.select();
        
        chai.assert.isArray(users, "Users.select should return an array");
        chai.expect(users.length).to.be.equal(0);
        
    });
    
    
    describe("multiple users", function () {
        
        beforeEach(function () {
            Users.add({ name: 'user 2' });
            Users.add({ name: 'user 3' });
        });
        
        afterEach(function () {
            Users.removeAll();
        });
        
        it('on filtering user 2, only user should be returned', function () {
            
            var users = Users.select("user 2");
            chai.expect(users[0].name).to.be.equal('user 2');
        });
        
        it('remove user 2 should remove from the list', function () {
            
            Users.remove("user 2");
            var users = Users.select();
            chai.expect(users.length).to.be.equal(2);
            chai.expect(users[0].name).to.be.equal('user 1');
            chai.expect(users[1].name).to.be.equal('user 3');
        });
        
        it('return true if user 3 exists', function () {
            
            var result = Users.contains('user 3');
            chai.expect(result).to.be.equal(true);

        });
        
        it('return false because user 4 does not exist', function () {
            
            var result = Users.contains('user 4');
            chai.expect(result).to.be.equal(false);

        });
        
        it('remove all users should have length 0', function () {
            Users.removeAll();
            var users = Users.select();
            chai.expect(users.length).to.be.equal(0);
        });

    });//describe

   




});