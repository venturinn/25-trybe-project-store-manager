const { expect } = require("chai");
const sinon = require("sinon");

const salesServices = require("../../../services/salesServices");
const salesModels = require("../../../models/salesModels");
const productsServices = require("../../../services/productsServices");
const salesProductsModels = require("../../../models/salesProductsModel");

describe("Service: busca todas as vendas cadastradas no BD", () => {
  describe("Quando não existe nenhuma venda criada", () => {
    before(() => {
      res = [];
      sinon.stub(salesModels, "getAllSales").resolves(res);
    });

    after(() => {
      salesModels.getAllSales.restore();
    });

    it("Retorna um array", async () => {
      const response = await salesServices.getAllSales();
      expect(response).to.be.an("array");
    });
    it("O array retornado está vazio", async () => {
      const response = await salesServices.getAllSales();
      expect(response).to.be.empty;
    });
  });

  describe("Quando existem vendas criadas", () => {
    before(async () => {
      const res = [
        {
          saleId: 1,
          date: "2022-05-30T18:23:59.000Z",
          productId: 1,
          quantity: 5,
        },
        {
          saleId: 1,
          date: "2022-05-30T18:23:59.000Z",
          productId: 2,
          quantity: 10,
        },
        {
          saleId: 2,
          date: "2022-05-30T18:23:59.000Z",
          productId: 3,
          quantity: 15,
        },
      ];
      sinon.stub(salesModels, "getAllSales").resolves(res);
    });

    after(async () => {
      salesModels.getAllSales.restore();
    });

    it("Retorna um array", async () => {
      const response = await salesServices.getAllSales();
      expect(response).to.be.an("array");
    });
    it("O array retornado não está vazio", async () => {
      const response = await salesServices.getAllSales();
      expect(response).to.be.not.empty;
    });
    it("O array possui itens do tipo objeto", async () => {
      const response = await salesServices.getAllSales();
      expect(response[0]).to.be.an("object");
    });
    it('Os itens possuem as propriedades: "saleId", "date", "productId" e "quantity"', async () => {
      const response = await salesServices.getAllSales();
      expect(response[0]).to.include.all.keys(
        "saleId",
        "date",
        "productId",
        "quantity"
      );
      expect(response[1]).to.include.all.keys(
        "saleId",
        "date",
        "productId",
        "quantity"
      );
      expect(response[2]).to.include.all.keys(
        "saleId",
        "date",
        "productId",
        "quantity"
      );
    });
  });
});

describe("Service: busca uma venda por meio do 'id'", () => {
  describe("Quando o 'id' buscado existe", () => {
    before(async () => {
      const res = {
        saleId: 1,
        date: "2022-05-30T18:23:59.000Z",
        productId: 1,
        quantity: 5,
      };
      sinon.stub(salesModels, "findSaleById").resolves(res);
    });

    after(async () => {
      salesModels.findSaleById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.findSaleById(1);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.findSaleById(1);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui as propriedades: saleId", "date", "productId", "quantity"', async () => {
      const response = await salesServices.findSaleById(1);
      expect(response).to.include.all.keys(
        "saleId",
        "date",
        "productId",
        "quantity"
      );
    });
  });

  describe("Quando o 'id' buscado não existe", () => {
    before(async () => {
      const res = null;
      sinon.stub(salesModels, "findSaleById").resolves(res);
    });

    after(async () => {
      salesModels.findSaleById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.findSaleById(1000);
      expect(response).to.be.an("object");
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await salesServices.findSaleById(1000);
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "notFound"', async () => {
      const response = await salesServices.findSaleById(1000);
      expect(response.error.code).to.equal("notFound");
    });
    it('A propriedade "message" possui o valor: "Sale not found"', async () => {
      const response = await salesServices.findSaleById(1000);
      expect(response.error.message).to.equal("Sale not found");
    });
  });
});

describe("Service: adiciona uma nova venda", () => {
  const newSaleData = [
    {
      productId: 1,
      quantity: 5,
    },
  ];
  describe("Quando a quantidade de produto em estoque é suficiente", () => {
    before(async () => {
      const res = { id: 1, name: "Martelo de Thor", quantity: 10 };

      sinon.stub(productsServices, "findProductById").resolves(res);
      sinon.stub(productsServices, "updateProductQuantity").resolves();
      sinon.stub(salesProductsModels, "addNewSale").resolves();
      sinon.stub(salesModels, "addNewSale").resolves(3);
    });

    after(async () => {
      productsServices.findProductById.restore();
      productsServices.updateProductQuantity.restore();
      salesProductsModels.addNewSale.restore();
      salesModels.addNewSale.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui as propriedades: "id" e "itemsSold"', async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response).to.include.all.keys("id", "itemsSold");
    });
    it("Os valores das propriedades do objeto retornado estão corretos", async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response.id).to.equal(3);
      expect(response.itemsSold).to.equal(newSaleData);
    });
  });

  describe("Quando a quantidade de produto em estoque NÃO é suficiente", () => {
    before(async () => {
      const res = { id: 1, name: "Martelo de Thor", quantity: 4 };
      sinon.stub(productsServices, "findProductById").resolves(res);
    });

    after(async () => {
      productsServices.findProductById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "UnprocessableEntity"', async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response.error.code).to.equal("UnprocessableEntity");
    });
    it('A propriedade "message" possui o valor: "Such amount is not permitted to sell"', async () => {
      const response = await salesServices.addNewSale(newSaleData);
      expect(response.error.message).to.equal(
        "Such amount is not permitted to sell"
      );
    });
  });
});

describe("Service: atualiza uma venda existente", () => {
  const newSaleData = [
    {
      productId: 1,
      quantity: 5,
    },
  ];

  describe("Quando o id da venda não existe no BD", () => {
    before(async () => {
      const res = null;
      sinon.stub(salesModels, "findSaleById").resolves(res);
    });

    after(async () => {
      salesModels.findSaleById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.updateSale(100, newSaleData);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.updateSale(100, newSaleData);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await salesServices.updateSale(100, newSaleData);
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "notFound"', async () => {
      const response = await salesServices.updateSale(100, newSaleData);
      expect(response.error.code).to.equal("notFound");
    });
    it('A propriedade "message" possui o valor: "Sale not found"', async () => {
      const response = await salesServices.updateSale(100, newSaleData);
      expect(response.error.message).to.equal("Sale not found");
    });
  });

  describe("Quando a quantidade de produto em estoque é suficiente", () => {
    before(async () => {
      const res1 = [
        {
          saleId: 1,
          date: "2022-05-30T18:23:59.000Z",
          productId: 1,
          quantity: 5,
        },
      ];
      const res2 = { id: 1, name: "Martelo de Thor", quantity: 10 };

      sinon.stub(salesModels, "findSaleById").resolves(res1);
      sinon.stub(productsServices, "findProductById").resolves(res2);
      sinon.stub(salesProductsModels, "deleteSale").resolves();
      sinon.stub(salesProductsModels, "addNewSale").resolves();
    });

    after(async () => {
      salesModels.findSaleById.restore();
      productsServices.findProductById.restore();
      salesProductsModels.deleteSale.restore();
      salesProductsModels.addNewSale.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui as propriedades: "saleId" e "itemUpdated"', async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response).to.include.all.keys("saleId", "itemUpdated");
    });
    it("Os valores das propriedades do objeto retornado estão corretos", async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response.saleId).to.equal(1);
      expect(response.itemUpdated).to.equal(newSaleData);
    });
  });

  describe("Quando a quantidade de produto em estoque NÃO é suficiente", () => {
    before(async () => {
      const res1 = [
        {
          saleId: 1,
          date: "2022-05-30T18:23:59.000Z",
          productId: 1,
          quantity: 5,
        },
      ];
      const res2 = { id: 1, name: "Martelo de Thor", quantity: 4 };
      sinon.stub(salesModels, "findSaleById").resolves(res1);
      sinon.stub(productsServices, "findProductById").resolves(res2);
    });

    after(async () => {
      salesModels.findSaleById.restore();
      productsServices.findProductById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "UnprocessableEntity"', async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response.error.code).to.equal("UnprocessableEntity");
    });
    it('A propriedade "message" possui o valor: "Such amount is not permitted to sell"', async () => {
      const response = await salesServices.updateSale(1, newSaleData);
      expect(response.error.message).to.equal(
        "Such amount is not permitted to sell"
      );
    });
  });
});

describe("Service: deleta uma venda existente", () => {
  describe("Quando o id da venda NÃO existe no BD", () => {
    before(async () => {
      const res = null;
      sinon.stub(salesModels, "findSaleById").resolves();
    });

    after(async () => {
      salesModels.findSaleById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.deleteSale(100);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.deleteSale(100);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await salesServices.deleteSale(100);
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "notFound"', async () => {
      const response = await salesServices.deleteSale(100);
      expect(response.error.code).to.equal("notFound");
    });
    it('A propriedade "message" possui o valor: "Sale not found"', async () => {
      const response = await salesServices.deleteSale(100);
      expect(response.error.message).to.equal("Sale not found");
    });
  });

  describe("Quando o id da venda existe no BD", () => {
    before(async () => {
      const res1 = [
        {
          saleId: 1,
          date: "2022-05-30T18:23:59.000Z",
          productId: 1,
          quantity: 5,
        },
      ];
      const res2 = [{ saleId: 1, productId: 1, quantity: 5 }];

      sinon.stub(salesModels, "findSaleById").resolves(res1);
      sinon.stub(salesProductsModels, "getSaleProductsData").resolves(res2);
      sinon.stub(productsServices, "findProductById").resolves();
      sinon.stub(productsServices, "updateProductQuantity").resolves();
      sinon.stub(salesProductsModels, "deleteSale").resolves();
      sinon.stub(salesModels, "deleteSale").resolves();
    });

    after(async () => {
      salesModels.findSaleById.restore();
      productsServices.findProductById.restore();
      productsServices.updateProductQuantity.restore();
      salesProductsModels.getSaleProductsData.restore();
      salesProductsModels.deleteSale.restore();
      salesModels.deleteSale.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await salesServices.deleteSale(1);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await salesServices.deleteSale(1);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui a propriedade: "deleted"', async () => {
      const response = await salesServices.deleteSale(1);
      expect(response).to.include.all.keys("deleted");
    });
    it('A propriedade "deleted" possui o valor correto', async () => {
      const response = await salesServices.deleteSale(1);
      expect(response.deleted).to.equal(1);
    });
  });
});
