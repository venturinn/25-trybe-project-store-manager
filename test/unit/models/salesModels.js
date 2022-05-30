const sinon = require("sinon");
const { expect } = require("chai");
const connection = require("../../../models/connection");
const salesModels = require("../../../models/salesModels");

// A função "deleteSale" não possui retorno e não foi testada"

// module.exports = {
//     getAllSales, //////////////////////////////////////
//     findSaleById, ///////////////////////////////
//     addNewSale,
//   };

describe("Busca todas as vendas cadastrados no BD", () => {
  describe("Quando não existe nenhuma venda criada", () => {
    before(async () => {
      const res = [[]];

      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna um array", async () => {
      const response = await salesModels.getAllSales();
      expect(response).to.be.an("array");
    });
    it("O array retornado está vazio", async () => {
      const response = await salesModels.getAllSales();
      expect(response).to.be.empty;
    });
  });
  describe("Quando existem vendas criadas", () => {
    before(async () => {
      const res = [
        [
          {
            sale_id: 1,
            date: "2022-05-30T18:23:59.000Z",
            product_id: 1,
            quantity: 5,
          },
          {
            sale_id: 1,
            date: "2022-05-30T18:23:59.000Z",
            product_id: 2,
            quantity: 10,
          },
          {
            sale_id: 2,
            date: "2022-05-30T18:23:59.000Z",
            product_id: 3,
            quantity: 15,
          },
        ],
      ];
      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna um array", async () => {
      const response = await salesModels.getAllSales();
      expect(response).to.be.an("array");
    });
    it("O array retornado não está vazio", async () => {
      const response = await salesModels.getAllSales();
      expect(response).to.be.not.empty;
    });
    it("O array possui itens do tipo objeto", async () => {
      const response = await salesModels.getAllSales();
      expect(response[0]).to.be.an("object");
      expect(response[1]).to.be.an("object");
      expect(response[2]).to.be.an("object");
    });
    it('Os itens possuem as propriedades: "saleId", "date", "productId" e "quantity"', async () => {
      const response = await salesModels.getAllSales();
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

describe("Busca uma venda por meio do 'id'", () => {
    describe("Quando o 'id' buscado existe", () => {
      before(async () => {
        const res = [[
              {
                sale_id: 1,
                date: "2022-05-30T18:23:59.000Z",
                product_id: 1,
                quantity: 5,
              }
          ]];
  
        sinon.stub(connection, "execute").resolves(res);
      });
  
      after(async () => {
        connection.execute.restore();
      });
  
      it("Retorna um array", async () => {
        const response = await salesModels.findSaleById(1);
        expect(response).to.be.an("array");
      });
      it("O array retornado não está vazio", async () => {
        const response = await salesModels.findSaleById(1);
        expect(response).to.be.not.empty;
      });
      it('O array retornado possui um objeto com as propriedades: "saleId", "date", "productId" e "quantity"', async () => {
        const response = await salesModels.findSaleById(1);
        expect(response[0]).to.include.all.keys(
        "saleId",
        "date",
        "productId",
        "quantity");
      });
    });
  
    describe("Quando o 'id' buscado não existe", () => {
      before(async () => {
        const res = [[]];
  
        sinon.stub(connection, "execute").resolves(res);
      });
  
      after(async () => {
        connection.execute.restore();
      });
  
      it("Retorna 'null'", async () => {
        const response = await salesModels.findSaleById(1000);
        expect(response).to.be.an("null");
      });
    });
  });

  describe("Insere uma nova venda no BD", () => {
    before(async () => {
      const res = [{ insertId: 1 }];
  
      sinon.stub(connection, "execute").resolves(res);
    });
  
    after(async () => {
      connection.execute.restore();
    });
  
    describe("Quando é inserido com sucesso", () => {
      it('Retorna o "id" da nova venda inserida', async () => {
        const response = await salesModels.addNewSale();
        expect(response).to.equal(1);
      });
    });
  });