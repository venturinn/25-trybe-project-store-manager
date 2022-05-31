const sinon = require("sinon");
const { expect } = require("chai");

const salesServices = require("../../../services/salesServices");
const salesControllers = require("../../../controllers/salesControllers");
const errorMiddleware = require("../../../middlewares/error");

describe("Controller: busca todos as vendas cadastradas no BD", () => {
  const res = {};

  const mockServicesReturn = [
    {
      saleId: 1,
      date: "2022-05-31T20:18:39.000Z",
      productId: 1,
      quantity: 5,
    },
    {
      saleId: 1,
      date: "2022-05-31T20:18:39.000Z",
      productId: 2,
      quantity: 10,
    },
    {
      saleId: 2,
      date: "2022-05-31T20:18:39.000Z",
      productId: 3,
      quantity: 15,
    },
  ];

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    sinon.stub(salesServices, "getAllSales").resolves(mockServicesReturn);
  });

  after(async () => {
    salesServices.getAllSales.restore();
  });

  it("é chamado o status com o código 200", async () => {
    await salesControllers.getAllSales(null, res);
    expect(res.status.calledWith(200)).to.be.equal(true);
  });

  it("é chamado o json com a mensagem correta", async () => {
    await salesControllers.getAllSales(null, res);
    expect(res.json.calledWith(mockServicesReturn)).to.be.equal(true);
  });
});

describe("Controller: busca as vendas por id", () => {
  describe("O id informado está presente no BD", () => {
    const res = {};
    const req = {};

    const mockServicesReturn = [
      {
        date: "2022-05-31T20:18:39.000Z",
        productId: 1,
        quantity: 5,
      },
      {
        date: "2022-05-31T20:18:39.000Z",
        productId: 2,
        quantity: 10,
      },
    ];

    before(() => {
      req.params = { id: 1 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(salesServices, "findSaleById").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.findSaleById.restore();
    });

    it("é chamado o status com o código 200", async () => {
      await salesControllers.findSaleById(req, res);
      expect(res.status.calledWith(200)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.findSaleById(req, res);
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
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      sinon.stub(salesServices, "findSaleById").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.findSaleById.restore();
    });

    it("é chamado o status com o código 404", async () => {
      await salesControllers.findSaleById(req, res, next);
      expect(res.status.calledWith(404)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.findSaleById(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
});

describe("Controller: adiciona uma nova venda no BD", () => {
  describe("A quantidade vendida NÃO ultrapassa a quantidade em estoque", () => {
    const res = {};
    const req = {};

    const mockServicesReturn = {
      id: 3,
      itemsSold: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 5 },
      ],
    };

    before(() => {
      req.body = [
        {
          productId: 1,
          quantity: 1,
        },
        {
          productId: 2,
          quantity: 5,
        },
      ];
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(salesServices, "addNewSale").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.addNewSale.restore();
    });

    it("é chamado o status com o código 201", async () => {
      await salesControllers.addNewSale(req, res);
      expect(res.status.calledWith(201)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.addNewSale(req, res);
      expect(res.json.calledWith(mockServicesReturn)).to.be.equal(true);
    });
  });

  describe("A quantidade vendida ultrapassa a quantidade em estoque", () => {
    const res = {};
    const req = {};
    const next = errorMiddleware;

    const mockServicesReturn = {
      error: {
        code: "UnprocessableEntity",
        message: "Such amount is not permitted to sell",
      },
    };

    before(() => {
      req.body = [
        {
          productId: 1,
          quantity: 1,
        },
        {
          productId: 2,
          quantity: 1000,
        },
      ];
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(salesServices, "addNewSale").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.addNewSale.restore();
    });

    it("é chamado o status com o código 422", async () => {
      await salesControllers.addNewSale(req, res, next);
      expect(res.status.calledWith(422)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.addNewSale(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
});

describe("Controller: atualiza uma venda no BD", () => {
  describe("O id informado está presente no BD e quantidade de produtos é compatível com o estoque", () => {
    const res = {};
    const req = {};

    const mockServicesReturn = {
      saleId: "1",
      itemUpdated: [{ productId: 1, quantity: 6 }],
    };

    before(() => {
      req.params = { id: 1 };
      req.body = [
        {
          productId: 1,
          quantity: 3,
        },
      ];
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(salesServices, "updateSale").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.updateSale.restore();
    });

    it("é chamado o status com o código 200", async () => {
      await salesControllers.updateSale(req, res);
      expect(res.status.calledWith(200)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.updateSale(req, res);
      expect(res.json.calledWith(mockServicesReturn)).to.be.equal(true);
    });
  });

  describe("A quantidade de produtos NÃO é compatível com o estoque", () => {
    const res = {};
    const req = {};
    const next = errorMiddleware;

    const mockServicesReturn = {
      error: { code: "notFound", message: "Sale not found" },
    };

    before(() => {
      req.params = { id: 1 };
      req.body = [
        {
          productId: 1,
          quantity: 3000,
        },
      ];
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      sinon.stub(salesServices, "updateSale").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.updateSale.restore();
    });

    it("é chamado o status com o código 404", async () => {
      await salesControllers.updateSale(req, res, next);
      expect(res.status.calledWith(404)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.updateSale(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
  describe("O id informado NÃO está presente no BD", () => {
    const res = {};
    const req = {};
    const next = errorMiddleware;

    const mockServicesReturn = {
      error: {
        code: "UnprocessableEntity",
        message: "Such amount is not permitted to sell",
      },
    };

    before(() => {
      req.params = { id: 100 };
      req.body = [
        {
          productId: 1,
          quantity: 3,
        },
      ];
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      sinon.stub(salesServices, "updateSale").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.updateSale.restore();
    });

    it("é chamado o status com o código 422", async () => {
      await salesControllers.updateSale(req, res, next);
      expect(res.status.calledWith(422)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.updateSale(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
});

describe("Controller: deleta uma venda no BD", () => {
  describe("O id informado está presente no BD", () => {
    const res = {};
    const req = {};

    const mockServicesReturn = { deleted: "1" };

    before(() => {
      req.params = { id: 1 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      sinon.stub(salesServices, "deleteSale").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.deleteSale.restore();
    });

    it("é chamado o status com o código 204", async () => {
      await salesControllers.deleteSale(req, res);
      expect(res.status.calledWith(204)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.deleteSale(req, res);
      expect(res.json.calledWith()).to.be.equal(true);
    });
  });

  describe("O id informado NÃO está presente no BD", () => {
    const res = {};
    const req = {};
    const next = errorMiddleware;

    const mockServicesReturn = {
      error: { code: "notFound", message: "Sale not found" },
    };

    before(() => {
      req.params = { id: 100 };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      sinon.stub(salesServices, "deleteSale").resolves(mockServicesReturn);
    });

    after(async () => {
      salesServices.deleteSale.restore();
    });

    it("é chamado o status com o código 404", async () => {
      await salesControllers.deleteSale(req, res, next);
      expect(res.status.calledWith(404)).to.be.equal(true);
    });

    it("é chamado o json com a mensagem correta", async () => {
      await salesControllers.deleteSale(req, res, next);
      const { message } = mockServicesReturn.error;
      expect(res.json.calledWith({ message })).to.be.equal(true);
    });
  });
});
