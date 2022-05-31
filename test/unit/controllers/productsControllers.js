const sinon = require("sinon");
const { expect } = require("chai");

const productsServices = require("../../../services/productsServices");
const productsControllers = require("../../../controllers/productsControllers");
const errorMiddleware = require("../../../middlewares/error");

describe("Controller: busca todos os produtos cadastrados no BD", () => {
  const res = {};

  const mockServicesReturn = [
    { id: 1, name: "Martelo de Thor", quantity: 5 },
    { id: 2, name: "Traje de encolhimento", quantity: 30 },
    { id: 3, name: "Escudo do Capitão América", quantity: 30 },
  ];

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    sinon.stub(productsServices, "getAllProducts").resolves(mockServicesReturn);
  });

  after(async () => {
    productsServices.getAllProducts.restore();
  });

  it("é chamado o status com o código 200", async () => {
    await productsControllers.getAllProducts(null, res);
    expect(res.status.calledWith(200)).to.be.equal(true);
  });

  it("é chamado o json com a mensagem correta", async () => {
    await productsControllers.getAllProducts(null, res);
    expect(res.json.calledWith(mockServicesReturn)).to.be.equal(true);
  });
});

describe("Controller: busca os produtos por id", () => {
  describe("O id informado está presente no BD", () => {
    const res = {};
    const req = {};

    const mockServicesReturn = { id: 1, name: "Martelo de Thor", quantity: 5 };

    before(() => {
      req.params = { id: 1 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon
        .stub(productsServices, "findProductById")
        .resolves(mockServicesReturn);
    });

    after(async () => {
      productsServices.findProductById.restore();
    });

    it("é chamado o status com o código 200", async () => {
      await productsControllers.findProductById(req, res);
      expect(res.status.calledWith(200)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await productsControllers.findProductById(req, res);
      expect(res.json.calledWith(mockServicesReturn)).to.be.equal(true);
    });
  });

  describe("O id informado NÃO está presente no BD", () => {
    const res = {};
    const req = {};
    const next = errorMiddleware;

    const mockServicesReturn = {
      error: { code: "notFound", message: "Product not found" },
    };

    before(() => {
      req.params = { id: 1 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      sinon
        .stub(productsServices, "findProductById")
        .resolves(mockServicesReturn);
    });

    after(async () => {
      productsServices.findProductById.restore();
    });

    it("é chamado o status com o código 404", async () => {
      await productsControllers.findProductById(req, res, next);
      expect(res.status.calledWith(404)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await productsControllers.findProductById(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
});

describe("Controller: adiciona um novo produto no BD", () => {
  describe("O novo produto NÃO é repetido no BD", () => {
    const res = {};
    const req = {};

    const mockServicesReturn = { id: 4, name: "Diego", quantity: 12 };

    before(() => {
      req.body = { name: "newProduct", quantity: 10 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon
        .stub(productsServices, "addNewProduct")
        .resolves(mockServicesReturn);
    });

    after(async () => {
      productsServices.addNewProduct.restore();
    });

    it("é chamado o status com o código 201", async () => {
      await productsControllers.addNewProduct(req, res);
      expect(res.status.calledWith(201)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await productsControllers.addNewProduct(req, res);
      expect(res.json.calledWith(mockServicesReturn)).to.be.equal(true);
    });
  });

  describe("O novo produto é repetido no BD", () => {
    const res = {};
    const req = {};
    const next = errorMiddleware;

    const mockServicesReturn = {
      error: { code: "alreadyExists", message: "Product already exists" },
    };

    before(() => {
      req.body = { name: "newProduct", quantity: 10 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon
        .stub(productsServices, "addNewProduct")
        .resolves(mockServicesReturn);
    });

    after(async () => {
      productsServices.addNewProduct.restore();
    });

    it("é chamado o status com o código 409", async () => {
      await productsControllers.addNewProduct(req, res, next);
      expect(res.status.calledWith(409)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await productsControllers.addNewProduct(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
});








describe("Controller: atualiza um produto no BD", () => {
  describe("O id informado está presente no BD", () => {
    const res = {};
    const req = {};

    const mockServicesReturn = { id: 1, name: "Martelo de Thor", quantity: 5 };

    before(() => {
      req.params = { id: 1 };
      req.body = { name: "Martelo de Thor", quantity: 10 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon
        .stub(productsServices, "updateProduct")
        .resolves(mockServicesReturn);
    });

    after(async () => {
      productsServices.updateProduct.restore();
    });

    it("é chamado o status com o código 200", async () => {
      await productsControllers.updateProduct(req, res);
      expect(res.status.calledWith(200)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await productsControllers.updateProduct(req, res);
      expect(res.json.calledWith(mockServicesReturn)).to.be.equal(true);
    });
  });

  describe("O id informado NÃO está presente no BD", () => {
    const res = {};
    const req = {};
    const next = errorMiddleware;

    const mockServicesReturn = {
      error: { code: "notFound", message: "Product not found" },
    };

    before(() => {
      req.params = { id: 100 };
      req.body = { name: "Martelo de Thor", quantity: 10 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      sinon
        .stub(productsServices, "updateProduct")
        .resolves(mockServicesReturn);
    });

    after(async () => {
      productsServices.updateProduct.restore();
    });

    it("é chamado o status com o código 404", async () => {
      await productsControllers.updateProduct(req, res, next);
      expect(res.status.calledWith(404)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await productsControllers.updateProduct(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
});













describe("Controller: deleta um produto no BD", () => {
    describe("O id informado está presente no BD", () => {
      const res = {};
      const req = {};
  
      const mockServicesReturn = { deleted: '1' };
  
      before(() => {
        req.params = { id: 1 };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
        sinon
          .stub(productsServices, "deleteProduct")
          .resolves(mockServicesReturn);
      });
  
      after(async () => {
        productsServices.deleteProduct.restore();
      });
  
      it("é chamado o status com o código 204", async () => {
        await productsControllers.deleteProduct(req, res);
        expect(res.status.calledWith(204)).to.be.equal(true);
      });
  
      it("é chamado o json com a mensagem correta", async () => {
        await productsControllers.deleteProduct(req, res);
        expect(res.json.calledWith()).to.be.equal(true);
      });
    });
  
    describe("O id informado NÃO está presente no BD", () => {
      const res = {};
      const req = {};
      const next = errorMiddleware;
  
      const mockServicesReturn = {
        error: { code: "notFound", message: "Product not found" },
      };
  
      before(() => {
        req.params = { id: 100 };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns(res);
        sinon
          .stub(productsServices, "deleteProduct")
          .resolves(mockServicesReturn);
      });
  
      after(async () => {
        productsServices.deleteProduct.restore();
      });
  
      it("é chamado o status com o código 404", async () => {
        await productsControllers.deleteProduct(req, res, next);
        expect(res.status.calledWith(404)).to.be.equal(true);
      });
  
      it("é chamado o json com a mensagem correta", async () => {
        await productsControllers.deleteProduct(req, res, next);
        const { message } = mockServicesReturn.error;
        expect(res.json.calledWith({ message })).to.be.equal(true);
      });
    });
  });