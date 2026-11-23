import { Router } from 'express';
//importa os controladores responsáveis por cada operação do recurso
import {
  listarChamados,
  buscarChamadoPorId,
  criarChamado,
  substituirChamado,
  atualizarParcialChamado,
  removerChamado
} from '../controllers/chamados.controller.js';

const router = Router();

//define as rotas CRUD de chamados
router.get('/', listarChamados);
router.get('/:id', buscarChamadoPorId);
router.post('/', criarChamado);
router.put('/:id', substituirChamado);
router.patch('/:id', atualizarParcialChamado);
router.delete('/:id', removerChamado);

export default router;