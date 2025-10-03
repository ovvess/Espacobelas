import{s as o}from"./index-dGQXMBuU.js";async function c(t){var n;try{const a=await o`SELECT to_regclass('public.' || ${t}) as reg`;return Array.isArray(a)&&!!((n=a[0])!=null&&n.reg)}catch{return!1}}async function R(t,n,a,e,s,r){const _=`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`;if(!await c("debitos_mensais"))throw new Error("Tabela debitos_mensais não encontrada. Configure Clientes Mensais antes de registrar débitos.");const i=await o`
    INSERT INTO debitos_mensais (
      cliente_id, agendamento_id, data_servico, servico_nome, 
      profissional_nome, valor, mes_referencia
    ) VALUES (
      ${n}, ${t}, ${a.toISOString()}, 
      ${e}, ${s}, ${r}, ${_}
    ) RETURNING *
  `;return{id:i[0].id,cliente_id:i[0].cliente_id,agendamento_id:i[0].agendamento_id,data_servico:new Date(i[0].data_servico),servico_nome:i[0].servico_nome,profissional_nome:i[0].profissional_nome,valor:parseFloat(i[0].valor),pago:i[0].pago,mes_referencia:i[0].mes_referencia,created_at:new Date(i[0].created_at)}}async function E(t,n){if(!await c("debitos_mensais"))return[];let a;return n?a=await o`
      SELECT * FROM debitos_mensais 
      WHERE cliente_id = ${t} AND mes_referencia = ${n}
      ORDER BY data_servico DESC
    `:a=await o`
      SELECT * FROM debitos_mensais 
      WHERE cliente_id = ${t}
      ORDER BY data_servico DESC
    `,a.map(e=>({id:e.id,cliente_id:e.cliente_id,agendamento_id:e.agendamento_id,data_servico:new Date(e.data_servico),servico_nome:e.servico_nome,profissional_nome:e.profissional_nome,valor:parseFloat(e.valor),pago:e.pago,mes_referencia:e.mes_referencia,created_at:new Date(e.created_at)}))}async function p(t,n){if(!await c("pagamentos_mensais"))return[];let a;return n?a=await o`
      SELECT * FROM pagamentos_mensais 
      WHERE cliente_id = ${t} AND mes_referencia = ${n}
      ORDER BY data_pagamento DESC
    `:a=await o`
      SELECT * FROM pagamentos_mensais 
      WHERE cliente_id = ${t}
      ORDER BY data_pagamento DESC
    `,a.map(e=>({id:e.id,cliente_id:e.cliente_id,mes_referencia:e.mes_referencia,valor_pago:parseFloat(e.valor_pago),data_pagamento:new Date(e.data_pagamento),observacoes:e.observacoes,created_at:new Date(e.created_at)}))}async function D(t,n,a,e){if(!await c("pagamentos_mensais"))throw new Error("Tabela pagamentos_mensais não encontrada. Configure Clientes Mensais antes de registrar pagamentos.");const s=await o`
    INSERT INTO pagamentos_mensais (
      cliente_id, mes_referencia, valor_pago, observacoes
    ) VALUES (
      ${t}, ${n}, ${a}, ${e}
    ) RETURNING *
  `;return{id:s[0].id,cliente_id:s[0].cliente_id,mes_referencia:s[0].mes_referencia,valor_pago:parseFloat(s[0].valor_pago),data_pagamento:new Date(s[0].data_pagamento),observacoes:s[0].observacoes,created_at:new Date(s[0].created_at)}}async function u(t){return await o`
    SELECT * FROM clientes 
    WHERE user_simple_id = ${t} AND tipo_cliente = 'mensal'
    ORDER BY nome
  `}async function $(t,n,a){await o`
    UPDATE clientes 
    SET tipo_cliente = ${a}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${t} AND user_simple_id = ${n}
  `}async function f(t,n,a){const s=(await o`
    SELECT * FROM clientes 
    WHERE id = ${t} AND user_simple_id = ${n}
  `)[0];if(!s)throw new Error("Cliente não encontrado");const r=await E(t,a),_=await p(t,a),i=r.reduce((l,d)=>l+d.valor,0),m=_.reduce((l,d)=>l+d.valor_pago,0),g=i-m;return{cliente:s,debitos:r,pagamentos:_,total_debito:i,total_pago:m,saldo_devedor:Math.max(0,g)}}async function b(t,n){const a=await u(t);return await Promise.all(a.map(async s=>{const r=await f(s.id,t,n);return{cliente:s,total_debito:r.total_debito,total_pago:r.total_pago,saldo_devedor:r.saldo_devedor,qtd_servicos:r.debitos.length}}))}export{f as a,$ as b,R as c,b as g,D as r};
